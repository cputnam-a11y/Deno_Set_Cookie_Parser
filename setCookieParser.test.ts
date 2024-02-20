import { CookieParser } from "../util.ts"
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
Deno.test({
  fn: () => {
    console.log("Testing CookieParser")
    const source =
      " _otwarchive_session=eyJfcmFpbHMiOnsibWVzc2FnZSI6ImV5SnpaWE56YVc5dVgybGtJam9pWVRsaE9UQTBORGhqT1RCbU16YzROREZrWkRCbVl6UTNPVFk0WlRZNU1EUWlMQ0pmWTNOeVpsOTBiMnRsYmlJNkltdzRSRVZaV201S04xcExRalJ0WDFjelFreG5RMkpMVVU4NExXYzFZMjFNT0RWUk5sbGFSV3MxTjAwOUluMD0iLCJleHAiOiIyMDI0LTAzLTA0VDIwOjQxOjUyLjg1NVoiLCJwdXIiOiJjb29raWUuX290d2FyY2hpdmVfc2Vzc2lvbiJ9fQ%3D%3D--5674396d996d5f088173cdf5ab00e07c196fdbb6; path=/; expires=Mon, 04 Mar 2024 20:41:52 GMT; HttpOnly; SameSite=Lax, __cf_bm=zqvU_gwKGMncIjRaXpR4pRleTtZFssTRbm6dryxnP1I-1708375312-1.0-AachOOdwUK5ZAuxj2N1iuDt4m+RvI5oNRtkAgYaOb3Ak9W50tOt3YaWgn+LRulCw3po29tyyPMqCililyoCLcIM=; path=/; expires=Mon, 19-Feb-24 21:11:52 GMT; domain=.archiveofourown.org; HttpOnly; Secure; SameSite=None, _cfuvid=XUvVmu_4.rgiWToYSxARXC5BSVLdVmFut2aATTgrCgw-1708375312881-0.0-604800000; path=/; domain=.archiveofourown.org; HttpOnly; Secure; SameSite=None"
    const parser = new CookieParser(source)
    const cookies = parser.parse()

    assertEquals(
      cookies.get("_otwarchive_session")?.value,
      "eyJfcmFpbHMiOnsibWVzc2FnZSI6ImV5SnpaWE56YVc5dVgybGtJam9pWVRsaE9UQTBORGhqT1RCbU16YzROREZrWkRCbVl6UTNPVFk0WlRZNU1EUWlMQ0pmWTNOeVpsOTBiMnRsYmlJNkltdzRSRVZaV201S04xcExRalJ0WDFjelFreG5RMkpMVVU4NExXYzFZMjFNT0RWUk5sbGFSV3MxTjAwOUluMD0iLCJleHAiOiIyMDI0LTAzLTA0VDIwOjQxOjUyLjg1NVoiLCJwdXIiOiJjb29raWUuX290d2FyY2hpdmVfc2Vzc2lvbiJ9fQ%3D%3D--5674396d996d5f088173cdf5ab00e07c196fdbb6",
    )
    console.log(cookies)
  },
  name: "CookieParserTest",
})
