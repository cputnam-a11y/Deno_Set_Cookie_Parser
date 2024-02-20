export class SetCookieParser {
  current: number
  start: number
  source: string
  state: ValidStates
  cookies: Array<Record<string, string>> = []
  currentCookie: Record<string, string> = {}
  // deno-lint-ignore no-inferrable-types
  currentProperty: string = ""
  constructor(source: string) {
    this.source = source
    this.start = 0
    this.current = 0
    this.state = ValidStates.Name
  }
  parse() {
    //console.log("parsing:", this.source)
    while (!this.isAtEnd()) {
      //console.log(this.state)
      this.parseOne()
      this.start = this.current
    }
    return this.cookies.reduce(
      (acc, c) => acc.set(c.name, c),
      new Map<string, Record<string, string>>(),
    )
  }
  parseOne() {
    switch (this.state) {
      case ValidStates.Name:
        this.parseName()
        break
      case ValidStates.Value:
        this.parseValue()
        break
      case ValidStates.Debug:
        //console.log("Debugger BreakPoint Reached", this.cookies)
        this.current = this.source.length
        break
      case ValidStates.PropertyName:
        this.parsePropName()
        break
      case ValidStates.PropertyValue:
        this.parsePropValue()
        break
      default:
        throw new Error("Unexpected state")
    }
  }
  parseName() {
    while (
      !this.isAtEnd() &&
      !(this.peek() == "=" || this.peek() == "," || this.peek() == ";")
    ) {
      this.advance()
    }
    // console.log("Name:", this.source.substring(this.start, this.current).trim())
    this.currentCookie.name = this.source.substring(this.start, this.current)
      .trim()
    this.current++
    this.state = ValidStates.Value
  }
  parseValue() {
    while (!this.isAtEnd() && !(this.peek() == ";" || this.peek() == ",")) {
      this.advance()
    }
    this.currentCookie.value = this.source.substring(this.start, this.current)
    this.afterNameAndValue()
  }
  afterNameAndValue() {
    if (this.isAtEnd()) {
      this.state = ValidStates.End
      this.cookies.push(this.currentCookie)
      this.currentCookie = {}
      return
    }
    this.currentProperty = ""
    const c = this.peek()
    this.advance()
    switch (c) {
      case ";":
        switch (this.state) {
          case ValidStates.Value:
            this.state = ValidStates.PropertyName
            break
          case ValidStates.PropertyValue:
            this.state = ValidStates.PropertyName
            break
          case ValidStates.PropertyName:
            this.state = ValidStates.PropertyName
            break
          default:
            throw new Error("Unexpected state: " + this.state)
        }
        this.state = ValidStates.PropertyName
        break
      case ",":
        this.state = ValidStates.Name
        this.cookies.push(this.currentCookie)
        this.currentCookie = {}
        break
      case "\0":
        this.state = ValidStates.End
        break
      default:
        throw new Error("Unexpected character")
    }
  }
  parsePropName() {
    while (
      !this.isAtEnd() &&
      !(this.peek() == "=" || this.peek() == ";" || this.peek() == ",")
    ) {
      this.advance()
    }
    if ((this.peek() == ";" || this.peek() == ",")) {
      this
        .currentCookie[this.source.substring(this.start, this.current).trim()] =
          ""
      this.afterNameAndValue()
      return
    }
    this.currentProperty = this.source.substring(this.start, this.current)
      .trim()
    this.currentCookie[this.currentProperty] = ""
    this.advance()
    this.state = ValidStates.PropertyValue
  }
  parsePropValue() {
    while (
      !this.isAtEnd() &&
      !(this.peek() == ";" ||
        (this.currentProperty != "expires" && this.peek() == ","))
    ) {
      this.advance()
    }
    this.currentCookie[this.currentProperty] = this.source.substring(
      this.start,
      this.current,
    )
    this.afterNameAndValue()
  }
  peek() {
    if (this.isAtEnd()) return "\0"
    return this.source[this.current]
  }
  peekNext() {
    if (this.current + 1 >= this.source.length) return "\0"
    return this.source[this.current + 1]
  }
  advance(): string {
    return this.source[this.current++]
  }
  isAtEnd() {
    return this.current >= this.source.length
  }
  match(expected: string) {
    if (this.isAtEnd()) return false
    if (this.source[this.current] != expected) return false
    this.current++
    return true
  }
  consume(expected: string) {
    if (this.match(expected)) return true
    throw new Error("Unexpected character")
  }
}
enum ValidStates {
  Name,
  Value,
  PropertyName,
  PropertyValue,
  Debug,
  End,
}
