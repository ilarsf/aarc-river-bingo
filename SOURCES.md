# Source notes

Animal identification and local occurrence references are retained in [animals.js](animals.js). The sources for the 82 fun facts are retained alongside the text in [facts.js](facts.js). They are not rendered in the app.

## Raptor silhouette guide

The guide uses stylized representative flight outlines. Each silhouette is displayed on one common linear wingspan scale, using the reference values below. The reported ranges describe variation between individuals; the images use range midpoints, except for Bald Eagle, whose source provides a representative 204 cm wingspan. The Turkey Vulture’s raised-wing V is a head-on flight cue, separate from the underside outline.

The descriptions were checked against Cornell Lab of Ornithology’s identification guides on November 9, 2026:

| Bird | Features used | Reference |
| --- | --- | --- |
| Osprey | Long, narrow wings with a slight wrist bend and shallow bowed profile | [Osprey identification](https://www.allaboutbirds.org/guide/osprey/id) |
| Bald Eagle | Broad wings held nearly level, large head and heavy body | [Bald Eagle identification](https://www.allaboutbirds.org/guide/bald_eagle/id) |
| Red-tailed Hawk | Broad, rounded wings and a short, broad tail | [Red-tailed Hawk identification](https://blog.allaboutbirds.org/guide/Red-tailed_Hawk/id) |
| Turkey Vulture | Small head, long tail, raised wings and rocking glide | [Turkey Vulture identification](https://www.allaboutbirds.org/guide/turkey_vulture/id/) |
| Cooper’s Hawk | Short rounded wings, projecting head, long rounded tail and flap–glide flight | [Cooper’s Hawk identification](https://www.allaboutbirds.org/guide/coopers_hawk/id) |

Cooper’s Hawk is included in the silhouette guide. Its local occurrence is supported by the City of Ann Arbor’s [breeding-bird survey](https://www.a2gov.org/parks-and-recreation/natural-area-preservation/birds/breeding-bird-survey/); this establishes Ann Arbor occurrence, rather than frequency on the rowing reach.

### Wingspan scale

All values come from the linked Cornell identification guides’ Measurements sections, checked November 9, 2026. The minimum and maximum values are converted to inches for display using 2.54 cm per inch, rounded to whole inches.

| Bird | Published wingspan | Reference wingspan used for image width | Width relative to Bald Eagle |
| --- | --- | --- | --- |
| Osprey | 150–180 cm | 165 cm | 80.88% |
| Bald Eagle | 204 cm | 204 cm | 100% |
| Red-tailed Hawk | 114–133 cm | 123.5 cm | 60.54% |
| Turkey Vulture | 170–178 cm | 174 cm | 85.29% |
| Cooper’s Hawk | 62–90 cm | 76 cm | 37.25% |

Image width is `referenceSpanCm / 204` times the shared art area’s inner width. Transparent canvas margins are trimmed from the image exports so that the bird outline, rather than empty padding, determines its displayed span. Images retain their aspect ratios.

## Silhouette artwork

The five guide PNGs were individually generated as transparent, representative black outlines. The Osprey was revised on November 9, 2026 after user review: its shallow wrist bend, smoother feather contours and smaller head replace an exaggerated M profile. The displayed wingspan scale is unchanged. The USFWS [Osprey soaring photograph by Brett Billings](https://www.fws.gov/media/osprey-soaring) served as an anatomical reference, not a traced outline.

The original generated images, superseded versions, exact prompts, source photographs and inspected hashes are preserved in the development repository under `artwork/guides/raptors/osprey/`, `docs/image-prompts/`, and `docs/review-evidence/osprey-silhouette-revision.json`. Full notes are in its `docs/source-notes-v3.md`. Generated art is a recognition aid; pose and flight angle change the apparent outline.
