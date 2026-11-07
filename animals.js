(function (root, factory) {
  const animals = factory();
  if (typeof module === 'object' && module.exports) module.exports = animals;
  else root.RiverBingoAnimals = animals;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // Locality records, ID references and facts have separate roles. The original
  // 25 IDs/order are retained for migration; eligibility controls future draws.
  const animals = [
  {
    "id": "canada-goose",
    "name": "Canada Goose",
    "scientific": "Branta canadensis",
    "group": "Birds",
    "cue": "A black neck with a bright white chinstrap.",
    "look": "Look for the long black neck, white cheek patch, and brown body. Often on the water or grazing along the bank.",
    "illustration": "Adult; sexes look similar.",
    "source": "https://www.allaboutbirds.org/guide/Canada_Goose/id/",
    "occurrence": [
      {
        "url": "https://www.inaturalist.org/check_lists/4338407-Barton-Nature-Area-Check-List",
        "title": "Barton Nature Area Check List",
        "date": "undated",
        "locator": "Named species checklist entries; observation dates and precision vary",
        "scope": "Barton Nature Area; community checklist",
        "claim": "Site-associated occurrence; not a standardized census or a promise of current Argo sightings.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/canada-goose/adult-1200.webp",
        "thumbnail": "assets/animals/canada-goose/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. Look for the long black neck, white cheek patch, and brown body. Often on the water or grazing along the bank."
      },
      {
        "id": "juvenile",
        "label": "Gosling",
        "image": "assets/animals/canada-goose/juvenile-1200.webp",
        "thumbnail": "assets/animals/canada-goose/juvenile-640.webp",
        "description": "Downy gosling, label stage"
      }
    ],
    "image": "assets/animals/canada-goose/adult-640.webp"
  },
  {
    "id": "mallard",
    "name": "Mallard",
    "scientific": "Anas platyrhynchos",
    "group": "Birds",
    "cue": "The familiar duck with a green-headed drake.",
    "look": "A breeding male has a green head, yellow bill, white neck ring, and chestnut breast. Females are mottled brown, with an orange-and-dark bill.",
    "illustration": "Adult male in breeding plumage. Females and nonbreeding males look different.",
    "source": "https://www.allaboutbirds.org/guide/Mallard/id/",
    "occurrence": [
      {
        "url": "https://www.inaturalist.org/check_lists/4338407-Barton-Nature-Area-Check-List",
        "title": "Barton Nature Area Check List",
        "date": "undated",
        "locator": "Named species checklist entries; observation dates and precision vary",
        "scope": "Barton Nature Area; community checklist",
        "claim": "Site-associated occurrence; not a standardized census or a promise of current Argo sightings.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/mallard/adult-male-1200.webp",
        "thumbnail": "assets/animals/mallard/adult-male-640.webp",
        "description": "Breeding green head/yellow bill"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/mallard/adult-female-1200.webp",
        "thumbnail": "assets/animals/mallard/adult-female-640.webp",
        "description": "Mottled brown/orange-dark bill"
      },
      {
        "id": "juvenile",
        "label": "Duckling",
        "image": "assets/animals/mallard/juvenile-1200.webp",
        "thumbnail": "assets/animals/mallard/juvenile-640.webp",
        "description": "Duckling, label stage; feathered immature may be added later"
      },
      {
        "id": "adult-male-eclipse",
        "label": "Nonbreeding male",
        "image": "assets/animals/mallard/adult-male-eclipse-1200.webp",
        "thumbnail": "assets/animals/mallard/adult-male-eclipse-640.webp",
        "description": "Nonbreeding eclipse adult male; species-specific bill and retained male features, not adult female"
      }
    ],
    "image": "assets/animals/mallard/adult-male-640.webp"
  },
  {
    "id": "wood-duck",
    "name": "Wood Duck",
    "scientific": "Aix sponsa",
    "group": "Birds",
    "cue": "A swept-back crest and striking facial stripes.",
    "look": "The male has an iridescent crest, red eye, white facial lines, and a chestnut breast. A female has a white teardrop around the eye. Look near wooded banks.",
    "illustration": "Adult male. Females have softer colors and a white eye patch.",
    "source": "https://www.allaboutbirds.org/guide/Wood_Duck/id/",
    "occurrence": [
      {
        "url": "https://www.inaturalist.org/check_lists/4338407-Barton-Nature-Area-Check-List",
        "title": "Barton Nature Area Check List",
        "date": "undated",
        "locator": "Named species checklist entries; observation dates and precision vary",
        "scope": "Barton Nature Area; community checklist",
        "claim": "Site-associated occurrence; not a standardized census or a promise of current Argo sightings.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/wood-duck/adult-male-1200.webp",
        "thumbnail": "assets/animals/wood-duck/adult-male-640.webp",
        "description": "Breeding ornamental crest/face"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/wood-duck/adult-female-1200.webp",
        "thumbnail": "assets/animals/wood-duck/adult-female-640.webp",
        "description": "Gray-brown, white eye teardrop"
      },
      {
        "id": "juvenile",
        "label": "Duckling",
        "image": "assets/animals/wood-duck/juvenile-1200.webp",
        "thumbnail": "assets/animals/wood-duck/juvenile-640.webp",
        "description": "Duckling; avoid borrowing Mallard pattern"
      },
      {
        "id": "adult-male-eclipse",
        "label": "Nonbreeding male",
        "image": "assets/animals/wood-duck/adult-male-eclipse-1200.webp",
        "thumbnail": "assets/animals/wood-duck/adult-male-eclipse-640.webp",
        "description": "Nonbreeding adult male; source precise bill/eye/plumage"
      }
    ],
    "image": "assets/animals/wood-duck/adult-male-640.webp"
  },
  {
    "id": "mute-swan",
    "name": "Mute Swan",
    "scientific": "Cygnus olor",
    "group": "Birds",
    "cue": "A white swan with an orange bill and black knob.",
    "look": "Check the orange bill and black bump at its base. The long neck often curves into an S. Other swans have different bill patterns.",
    "illustration": "Adult. Young birds may be gray or brown.",
    "source": "https://www.allaboutbirds.org/guide/Mute_Swan/id/",
    "occurrence": [
      {
        "url": "https://www.inaturalist.org/check_lists/4338407-Barton-Nature-Area-Check-List",
        "title": "Barton Nature Area Check List",
        "date": "undated",
        "locator": "Named species checklist entries; observation dates and precision vary",
        "scope": "Barton Nature Area; community checklist",
        "claim": "Site-associated occurrence; not a standardized census or a promise of current Argo sightings.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/mute-swan/adult-1200.webp",
        "thumbnail": "assets/animals/mute-swan/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. Check the orange bill and black bump at its base. The long neck often curves into an S. Other swans have different bill patterns."
      },
      {
        "id": "juvenile",
        "label": "Cygnet",
        "image": "assets/animals/mute-swan/juvenile-1200.webp",
        "thumbnail": "assets/animals/mute-swan/juvenile-640.webp",
        "description": "Gray/brown cygnet; state not all young are gray"
      }
    ],
    "image": "assets/animals/mute-swan/adult-640.webp"
  },
  {
    "id": "great-blue-heron",
    "name": "Great Blue Heron",
    "scientific": "Ardea herodias",
    "group": "Birds",
    "cue": "Tall, blue-gray, and wonderfully patient.",
    "look": "A large blue-gray wading bird with very long legs, a dagger-like bill, and a dark stripe over the eye. In flight, the neck folds back.",
    "illustration": "Adult, standing. Size is not to scale across tiles.",
    "source": "https://www.allaboutbirds.org/guide/Great_Blue_Heron/id/",
    "occurrence": [
      {
        "url": "https://www.inaturalist.org/check_lists/4338407-Barton-Nature-Area-Check-List",
        "title": "Barton Nature Area Check List",
        "date": "undated",
        "locator": "Named species checklist entries; observation dates and precision vary",
        "scope": "Barton Nature Area; community checklist",
        "claim": "Site-associated occurrence; not a standardized census or a promise of current Argo sightings.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/great-blue-heron/adult-1200.webp",
        "thumbnail": "assets/animals/great-blue-heron/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. A large blue-gray wading bird with very long legs, a dagger-like bill, and a dark stripe over the eye. In flight, the neck folds back."
      }
    ],
    "image": "assets/animals/great-blue-heron/adult-640.webp"
  },
  {
    "id": "green-heron",
    "name": "Green Heron",
    "scientific": "Butorides virescens",
    "group": "Birds",
    "cue": "A small, stocky heron with a chestnut neck.",
    "look": "Much smaller than a Great Blue Heron. Look for a dark cap, greenish back, rich brown neck, and short-looking yellow legs along the water’s edge. Young birds can be brown and heavily streaked rather than showing the adult colors.",
    "illustration": "Adult with its neck partly tucked.",
    "source": "https://www.allaboutbirds.org/guide/Green_Heron/id/",
    "occurrence": [
      {
        "url": "docs/original-research-plan.md",
        "title": "Supplied research plan",
        "date": "undated",
        "locator": "Species roster",
        "scope": "Proposed seasonal/challenge target; local evidence gap",
        "claim": "Retained from the supplied plan. This release has not independently established a reach-specific observation series; ID guides do not prove local occurrence.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/green-heron/adult-1200.webp",
        "thumbnail": "assets/animals/green-heron/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. Much smaller than a Great Blue Heron. Look for a dark cap, greenish back, rich brown neck, and short-looking yellow legs along the water’s edge."
      },
      {
        "id": "juvenile",
        "label": "Streaked young",
        "image": "assets/animals/green-heron/juvenile-1200.webp",
        "thumbnail": "assets/animals/green-heron/juvenile-640.webp",
        "description": "Brown, streaked neck/breast, pale wing spotting"
      }
    ],
    "image": "assets/animals/green-heron/adult-640.webp"
  },
  {
    "id": "great-egret",
    "name": "Great Egret",
    "scientific": "Ardea alba",
    "group": "Birds",
    "cue": "All white, with a yellow bill and black legs.",
    "look": "A tall white heron with a long yellow bill and black legs and feet. The neck folds back in flight, unlike a swan’s outstretched neck.",
    "illustration": "Adult. The yellow bill and dark legs are key clues.",
    "source": "https://www.allaboutbirds.org/guide/Great_Egret/id/",
    "occurrence": [
      {
        "url": "docs/original-research-plan.md",
        "title": "Supplied research plan",
        "date": "undated",
        "locator": "Species roster",
        "scope": "Proposed seasonal/challenge target; local evidence gap",
        "claim": "Retained from the supplied plan. This release has not independently established a reach-specific observation series; ID guides do not prove local occurrence.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/great-egret/adult-1200.webp",
        "thumbnail": "assets/animals/great-egret/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. A tall white heron with a long yellow bill and black legs and feet. The neck folds back in flight, unlike a swan’s outstretched neck."
      }
    ],
    "image": "assets/animals/great-egret/adult-640.webp"
  },
  {
    "id": "belted-kingfisher",
    "name": "Belted Kingfisher",
    "scientific": "Megaceryle alcyon",
    "group": "Birds",
    "cue": "A shaggy crest and a rattling riverbank call.",
    "look": "Look for a large crested head, heavy pointed bill, blue-gray back and chest band, and white collar. Often watches the water from an exposed perch.",
    "illustration": "Adult male. Females also have a rusty band across the belly.",
    "source": "https://www.allaboutbirds.org/guide/Belted_Kingfisher/id/",
    "occurrence": [
      {
        "url": "https://www.inaturalist.org/check_lists/4338407-Barton-Nature-Area-Check-List",
        "title": "Barton Nature Area Check List",
        "date": "undated",
        "locator": "Named species checklist entries; observation dates and precision vary",
        "scope": "Barton Nature Area; community checklist",
        "claim": "Site-associated occurrence; not a standardized census or a promise of current Argo sightings.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/belted-kingfisher/adult-male-1200.webp",
        "thumbnail": "assets/animals/belted-kingfisher/adult-male-640.webp",
        "description": "Blue-gray chest band"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/belted-kingfisher/adult-female-1200.webp",
        "thumbnail": "assets/animals/belted-kingfisher/adult-female-640.webp",
        "description": "Additional rusty belly band"
      }
    ],
    "image": "assets/animals/belted-kingfisher/adult-male-640.webp"
  },
  {
    "id": "osprey",
    "name": "Osprey",
    "scientific": "Pandion haliaetus",
    "group": "Birds",
    "cue": "A fish-hunting raptor with a dark eye stripe.",
    "look": "A white head with a bold dark eye stripe, dark back, and pale underside. In flight, the long wings often bend at the wrists into a shallow M.",
    "illustration": "Adult. Check the eye stripe and pale underside.",
    "source": "https://www.allaboutbirds.org/guide/Osprey/id/",
    "occurrence": [
      {
        "url": "https://www.hrwc.org/wp-content/uploads/2012/08/HuronRiverReportFall2012.pdf#page=1",
        "title": "Huron River Report — Osprey",
        "date": "2012-09",
        "locator": "Osprey article, printed pp. 1 and 3",
        "scope": "Huron River watershed; historical restoration",
        "claim": "Historical watershed restoration account; no current local nest is promised.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/osprey/adult-1200.webp",
        "thumbnail": "assets/animals/osprey/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. A white head with a bold dark eye stripe, dark back, and pale underside. In flight, the long wings often bend at the wrists into a shallow M."
      },
      {
        "id": "juvenile",
        "label": "Scaly-backed young",
        "image": "assets/animals/osprey/juvenile-1200.webp",
        "thumbnail": "assets/animals/osprey/juvenile-640.webp",
        "description": "Pale-edged/scaly upperparts; correct young eye color"
      }
    ],
    "image": "assets/animals/osprey/adult-640.webp"
  },
  {
    "id": "bald-eagle",
    "name": "Bald Eagle",
    "scientific": "Haliaeetus leucocephalus",
    "group": "Birds",
    "cue": "A white head and tail on a powerful dark bird.",
    "look": "Adults have a white head and tail, dark brown body, and large yellow bill. Young eagles are mottled brown and do not yet have the familiar white head.",
    "illustration": "Adult. Immature eagles look very different.",
    "source": "https://www.allaboutbirds.org/guide/Bald_Eagle/id/",
    "occurrence": [
      {
        "url": "https://www.hrwc.org/wp-content/uploads/2009/09/HuronRiverReport_2006_Spring.pdf#page=4",
        "title": "Huron River Report — Bald Eagle",
        "date": "2006-03",
        "locator": "Printed p. 4, BALD EAGLE",
        "scope": "Argo Pond; historical account",
        "claim": "Recounts an eagle over Argo Pond; not a current sighting or nest claim.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/bald-eagle/adult-1200.webp",
        "thumbnail": "assets/animals/bald-eagle/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. Adults have a white head and tail, dark brown body, and large yellow bill. Young eagles are mottled brown and do not yet have the familiar white head."
      },
      {
        "id": "juvenile",
        "label": "Brown immature",
        "image": "assets/animals/bald-eagle/juvenile-1200.webp",
        "thumbnail": "assets/animals/bald-eagle/juvenile-640.webp",
        "description": "First-year mostly dark/mottled, dark bill"
      }
    ],
    "image": "assets/animals/bald-eagle/adult-640.webp"
  },
  {
    "id": "red-tailed-hawk",
    "name": "Red-tailed Hawk",
    "scientific": "Buteo jamaicensis",
    "group": "Birds",
    "cue": "Broad wings and an adult’s rusty-red tail.",
    "look": "A broad-winged hawk, often circling high or perched in the open. Many have a dark band across a pale belly; adults usually show a reddish tail from above.",
    "illustration": "Adult. Plumage varies, and juveniles have a banded brown tail.",
    "source": "https://www.allaboutbirds.org/guide/Red-tailed_Hawk/id/",
    "occurrence": [
      {
        "url": "docs/original-research-plan.md",
        "title": "Supplied research plan",
        "date": "undated",
        "locator": "Species roster",
        "scope": "Proposed seasonal/challenge target; local evidence gap",
        "claim": "Retained from the supplied plan. This release has not independently established a reach-specific observation series; ID guides do not prove local occurrence.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/red-tailed-hawk/adult-1200.webp",
        "thumbnail": "assets/animals/red-tailed-hawk/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. A broad-winged hawk, often circling high or perched in the open. Many have a dark band across a pale belly; adults usually show a reddish tail from above."
      },
      {
        "id": "juvenile",
        "label": "Young with barred tail",
        "image": "assets/animals/red-tailed-hawk/juvenile-1200.webp",
        "thumbnail": "assets/animals/red-tailed-hawk/juvenile-640.webp",
        "description": "Brown banded tail, no red adult tail"
      }
    ],
    "image": "assets/animals/red-tailed-hawk/adult-640.webp"
  },
  {
    "id": "turkey-vulture",
    "name": "Turkey Vulture",
    "scientific": "Cathartes aura",
    "group": "Birds",
    "cue": "A dark soaring bird that rocks in a shallow V.",
    "look": "Look for long wings held slightly above the body and a teetering glide. The flight feathers look pale beneath darker forewings. Adults have a small bare red head.",
    "illustration": "Adult in flight. The red head can be hard to see at a distance.",
    "source": "https://www.allaboutbirds.org/guide/Turkey_Vulture/id/",
    "occurrence": [
      {
        "url": "docs/original-research-plan.md",
        "title": "Supplied research plan",
        "date": "undated",
        "locator": "Species roster",
        "scope": "Proposed seasonal/challenge target; local evidence gap",
        "claim": "Retained from the supplied plan. This release has not independently established a reach-specific observation series; ID guides do not prove local occurrence.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/turkey-vulture/adult-1200.webp",
        "thumbnail": "assets/animals/turkey-vulture/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. Look for long wings held slightly above the body and a teetering glide. The flight feathers look pale beneath darker forewings. Adults have a small bare red head."
      },
      {
        "id": "juvenile",
        "label": "Dark-headed young",
        "image": "assets/animals/turkey-vulture/juvenile-1200.webp",
        "thumbnail": "assets/animals/turkey-vulture/juvenile-640.webp",
        "description": "Dark head; same two-tone underwings"
      }
    ],
    "image": "assets/animals/turkey-vulture/adult-640.webp"
  },
  {
    "id": "baltimore-oriole",
    "name": "Baltimore Oriole",
    "scientific": "Icterus galbula",
    "group": "Birds",
    "cue": "A flash of orange and black in the treetops.",
    "look": "An adult male has a black head and back, bright orange underside, and white wing markings. Females and younger birds are softer yellow-orange.",
    "illustration": "Adult male. Females and young birds differ.",
    "source": "https://www.allaboutbirds.org/guide/Baltimore_Oriole/id/",
    "occurrence": [
      {
        "url": "https://www.inaturalist.org/check_lists/4338407-Barton-Nature-Area-Check-List",
        "title": "Barton Nature Area Check List",
        "date": "undated",
        "locator": "Named species checklist entries; observation dates and precision vary",
        "scope": "Barton Nature Area; community checklist",
        "claim": "Site-associated occurrence; not a standardized census or a promise of current Argo sightings.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/baltimore-oriole/adult-male-1200.webp",
        "thumbnail": "assets/animals/baltimore-oriole/adult-male-640.webp",
        "description": "Black/orange adult"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/baltimore-oriole/adult-female-1200.webp",
        "thumbnail": "assets/animals/baltimore-oriole/adult-female-640.webp",
        "description": "Muted orange/yellow, variable dark head"
      }
    ],
    "image": "assets/animals/baltimore-oriole/adult-male-640.webp"
  },
  {
    "id": "tree-swallow",
    "name": "Tree Swallow",
    "scientific": "Tachycineta bicolor",
    "group": "Birds",
    "cue": "Glossy blue-green above, clean white below.",
    "look": "A small aerial insect hunter with a white underside and short, slightly notched tail. Adults are blue-green above; brown upperparts can indicate young birds or some first-year females. Brown appearance alone cannot establish age or sex.",
    "illustration": "Adult. Juveniles are brown above.",
    "source": "https://www.allaboutbirds.org/guide/Tree_Swallow/id/",
    "occurrence": [
      {
        "url": "https://www.inaturalist.org/check_lists/4338407-Barton-Nature-Area-Check-List",
        "title": "Barton Nature Area Check List",
        "date": "undated",
        "locator": "Named species checklist entries; observation dates and precision vary",
        "scope": "Barton Nature Area; community checklist",
        "claim": "Site-associated occurrence; not a standardized census or a promise of current Argo sightings.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/tree-swallow/adult-1200.webp",
        "thumbnail": "assets/animals/tree-swallow/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. A small aerial insect hunter with a glossy blue-green back, white underside, and slightly notched tail. Watch over open water and nearby fields."
      },
      {
        "id": "juvenile",
        "label": "Brown form (young / some females)",
        "image": "assets/animals/tree-swallow/juvenile-1200.webp",
        "thumbnail": "assets/animals/tree-swallow/juvenile-640.webp",
        "description": "Brown upperparts can occur in young birds and some first-year females; appearance alone does not prove age or sex."
      }
    ],
    "image": "assets/animals/tree-swallow/adult-640.webp"
  },
  {
    "id": "chimney-swift",
    "name": "Chimney Swift",
    "scientific": "Chaetura pelagica",
    "group": "Birds",
    "cue": "A dark flying cigar with long, curved wings.",
    "look": "A short-tailed, cigar-shaped body with slender curved wings. Almost entirely sooty brown, with stiff, rapid wingbeats. It lacks a swallow’s bright white belly.",
    "illustration": "In flight. Swifts cling to vertical surfaces rather than perching on branches.",
    "source": "https://www.allaboutbirds.org/guide/Chimney_Swift/id/",
    "occurrence": [
      {
        "url": "docs/original-research-plan.md",
        "title": "Supplied research plan",
        "date": "undated",
        "locator": "Species roster",
        "scope": "Proposed seasonal/challenge target; local evidence gap",
        "claim": "Retained from the supplied plan. This release has not independently established a reach-specific observation series; ID guides do not prove local occurrence.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/chimney-swift/adult-1200.webp",
        "thumbnail": "assets/animals/chimney-swift/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. A short-tailed, cigar-shaped body with slender curved wings. Almost entirely sooty brown, with stiff, rapid wingbeats. It lacks a swallow’s bright white belly."
      }
    ],
    "image": "assets/animals/chimney-swift/adult-640.webp"
  },
  {
    "id": "red-winged-blackbird",
    "name": "Red-winged Blackbird",
    "scientific": "Agelaius phoeniceus",
    "group": "Birds",
    "cue": "Black plumage with red-and-yellow shoulders.",
    "look": "Adult males show scarlet shoulder patches edged with yellow. Females are brown and heavily streaked. Look near reeds and wet shoreline vegetation.",
    "illustration": "Adult male. Females look very different.",
    "source": "https://www.allaboutbirds.org/guide/Red-winged_Blackbird/id/",
    "occurrence": [
      {
        "url": "https://www.inaturalist.org/check_lists/4338407-Barton-Nature-Area-Check-List",
        "title": "Barton Nature Area Check List",
        "date": "undated",
        "locator": "Named species checklist entries; observation dates and precision vary",
        "scope": "Barton Nature Area; community checklist",
        "claim": "Site-associated occurrence; not a standardized census or a promise of current Argo sightings.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/red-winged-blackbird/adult-male-1200.webp",
        "thumbnail": "assets/animals/red-winged-blackbird/adult-male-640.webp",
        "description": "Black with red/yellow epaulet"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/red-winged-blackbird/adult-female-1200.webp",
        "thumbnail": "assets/animals/red-winged-blackbird/adult-female-640.webp",
        "description": "Brown streaked, pale eyebrow"
      }
    ],
    "image": "assets/animals/red-winged-blackbird/adult-male-640.webp"
  },
  {
    "id": "american-beaver",
    "name": "American Beaver",
    "scientific": "Castor canadensis",
    "group": "Mammals",
    "cue": "A large brown swimmer with a broad paddle tail.",
    "look": "A stocky brown mammal with small ears and a broad, flat, scaly tail. The tail is often underwater, so do not rely on a swimming silhouette alone.",
    "illustration": "Shown on land so the paddle-shaped tail is visible.",
    "source": "https://www.hrwc.org/oh-dam-was-that-a-beaver/",
    "occurrence": [
      {
        "url": "https://www.hrwc.org/our-watershed/features/",
        "title": "HRWC — Watershed Features",
        "date": "undated",
        "locator": "Biodiversity, mammal list",
        "scope": "Huron River watershed",
        "claim": "Regional presence; no comparable Barton-to-Argo mammal census. Direct locality passages remain unverified for Muskrat and Raccoon.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": false,
    "cardPolicyReason": "Conservative daylight game choice; mainly night/dusk, occasional daytime activity does not make it a card target.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/american-beaver/adult-1200.webp",
        "thumbnail": "assets/animals/american-beaver/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. A stocky brown mammal with small ears and a broad, flat, scaly tail. The tail is often underwater, so do not rely on a swimming silhouette alone."
      }
    ],
    "image": "assets/animals/american-beaver/adult-640.webp"
  },
  {
    "id": "muskrat",
    "name": "Muskrat",
    "scientific": "Ondatra zibethicus",
    "group": "Mammals",
    "cue": "A small brown swimmer with a narrow tail.",
    "look": "Smaller than a beaver, with a compact body, small rounded ears, and a long narrow tail. Look along vegetated edges; a brief head-only view can be ambiguous.",
    "illustration": "Shown on land to make the narrow tail visible.",
    "source": "https://gf.nd.gov/wildlife/id/rodents/muskrat",
    "occurrence": [
      {
        "url": "https://www.hrwc.org/our-watershed/features/",
        "title": "HRWC — Watershed Features",
        "date": "undated",
        "locator": "Biodiversity, mammal list",
        "scope": "Huron River watershed",
        "claim": "Regional presence; no comparable Barton-to-Argo mammal census. Direct locality passages remain unverified for Muskrat and Raccoon.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": false,
    "cardPolicyReason": "Conservative daylight game choice; night/dusk shore mammal.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/muskrat/adult-1200.webp",
        "thumbnail": "assets/animals/muskrat/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. Smaller than a beaver, with a compact body, small rounded ears, and a long narrow tail. Look along vegetated edges; a brief head-only view can be ambiguous."
      }
    ],
    "image": "assets/animals/muskrat/adult-640.webp"
  },
  {
    "id": "white-tailed-deer",
    "name": "White-tailed Deer",
    "scientific": "Odocoileus virginianus",
    "group": "Mammals",
    "cue": "A white tail flag disappearing into the trees.",
    "look": "A slender deer with large ears and a white underside to its tail. Watch quiet banks and openings in riverside vegetation. Spotted fawns and antlerless adults also qualify; absence of antlers alone does not prove the animal is female.",
    "illustration": "Adult doe with the white underside of the tail visible.",
    "source": "https://www.in.gov/dnr/fish-and-wildlife/wildlife-resources/animals/white-tailed-deer-biology/",
    "occurrence": [
      {
        "url": "https://www.hrwc.org/our-watershed/features/",
        "title": "HRWC — Watershed Features",
        "date": "undated",
        "locator": "Biodiversity, mammal list",
        "scope": "Huron River watershed",
        "claim": "Regional presence; no comparable Barton-to-Argo mammal census. Direct locality passages remain unverified for Muskrat and Raccoon.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/white-tailed-deer/adult-male-1200.webp",
        "thumbnail": "assets/animals/white-tailed-deer/adult-male-640.webp",
        "description": "Typical adult buck in antler season"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/white-tailed-deer/adult-female-1200.webp",
        "thumbnail": "assets/animals/white-tailed-deer/adult-female-640.webp",
        "description": "Illustrated doe. Antlerless animals in the field are not automatically female."
      },
      {
        "id": "juvenile",
        "label": "Spotted fawn",
        "image": "assets/animals/white-tailed-deer/juvenile-1200.webp",
        "thumbnail": "assets/animals/white-tailed-deer/juvenile-640.webp",
        "description": "Spotted fawn"
      }
    ],
    "image": "assets/animals/white-tailed-deer/adult-male-640.webp"
  },
  {
    "id": "raccoon",
    "name": "Raccoon",
    "scientific": "Procyon lotor",
    "group": "Mammals",
    "cue": "A black eye mask and a ringed, bushy tail.",
    "look": "A stocky gray-brown mammal with a dark mask and alternating dark and pale tail rings. Dawn and dusk offer a better chance than the middle of the day.",
    "illustration": "Adult; sexes look similar.",
    "source": "https://mdc.mo.gov/discover-nature/field-guide/raccoon",
    "occurrence": [
      {
        "url": "https://www.hrwc.org/our-watershed/features/",
        "title": "HRWC — Watershed Features",
        "date": "undated",
        "locator": "Biodiversity, mammal list",
        "scope": "Huron River watershed",
        "claim": "Regional presence; no comparable Barton-to-Argo mammal census. Direct locality passages remain unverified for Muskrat and Raccoon.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": false,
    "cardPolicyReason": "Mainly nocturnal; catalog only.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/raccoon/adult-1200.webp",
        "thumbnail": "assets/animals/raccoon/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. A stocky gray-brown mammal with a dark mask and alternating dark and pale tail rings. Dawn and dusk offer a better chance than the middle of the day."
      }
    ],
    "image": "assets/animals/raccoon/adult-640.webp"
  },
  {
    "id": "common-map-turtle",
    "name": "Common Map Turtle",
    "scientific": "Graptemys geographica",
    "group": "Turtles",
    "cue": "Fine yellow lines like a little contour map.",
    "look": "Also called Northern Map Turtle. Look for fine yellow patterning on an olive shell, narrow head stripes, and a yellow spot behind the eye. Often basks on logs.",
    "illustration": "A basking turtle. Fine markings can be difficult to resolve from a boat.",
    "source": "https://www.a2gov.org/parks-and-recreation/natural-area-preservation/amphibians-and-reptiles/turtles/",
    "aliases": [
      "Northern Map Turtle"
    ],
    "occurrence": [
      {
        "url": "https://deepblue.lib.umich.edu/bitstream/handle/2027.42/196897/Three%20Decades%20of%20Community%20Science%20Wildlife%20Monitoring.pdf?isAllowed=y&sequence=1",
        "title": "Three Decades of Community Science Wildlife Monitoring",
        "date": "undated",
        "locator": "River-reach analysis; turtle species between Barton and Argo dams",
        "scope": "Barton-to-Argo river reach; historical community monitoring",
        "claim": "Named among turtle species reported from this reach. Historical counts are not encounter probabilities.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/common-map-turtle/adult-1200.webp",
        "thumbnail": "assets/animals/common-map-turtle/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. Also called Northern Map Turtle. Look for fine yellow patterning on an olive shell, narrow head stripes, and a yellow spot behind the eye. Often basks on logs."
      }
    ],
    "image": "assets/animals/common-map-turtle/adult-640.webp"
  },
  {
    "id": "painted-turtle",
    "name": "Painted Turtle",
    "scientific": "Chrysemys picta",
    "group": "Turtles",
    "cue": "A smooth dark shell with red along the edge.",
    "look": "Look for red-orange markings along the shell margin and yellow or red striping on the head and limbs. A red ear patch instead suggests a slider.",
    "illustration": "A basking turtle with the colored shell margin visible.",
    "source": "https://www.a2gov.org/parks-and-recreation/natural-area-preservation/amphibians-and-reptiles/turtles/",
    "occurrence": [
      {
        "url": "https://deepblue.lib.umich.edu/bitstream/handle/2027.42/196897/Three%20Decades%20of%20Community%20Science%20Wildlife%20Monitoring.pdf?isAllowed=y&sequence=1",
        "title": "Three Decades of Community Science Wildlife Monitoring",
        "date": "undated",
        "locator": "River-reach analysis; turtle species between Barton and Argo dams",
        "scope": "Barton-to-Argo river reach; historical community monitoring",
        "claim": "Named among turtle species reported from this reach. Historical counts are not encounter probabilities.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/painted-turtle/adult-1200.webp",
        "thumbnail": "assets/animals/painted-turtle/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. Look for red-orange markings along the shell margin and yellow or red striping on the head and limbs. A red ear patch instead suggests a slider."
      }
    ],
    "image": "assets/animals/painted-turtle/adult-640.webp"
  },
  {
    "id": "spiny-softshell-turtle",
    "name": "Spiny Softshell Turtle",
    "scientific": "Apalone spinifera",
    "group": "Turtles",
    "cue": "A flat, leathery shell and a long pointed snout.",
    "look": "A broad, flattened turtle with a soft-looking olive or gray shell, often dotted with dark spots, and a long, snorkel-like nose.",
    "illustration": "Shown at a low angle to emphasize the flat shell and pointed snout.",
    "source": "https://www.a2gov.org/parks-and-recreation/natural-area-preservation/amphibians-and-reptiles/turtles/",
    "occurrence": [
      {
        "url": "https://deepblue.lib.umich.edu/bitstream/handle/2027.42/196897/Three%20Decades%20of%20Community%20Science%20Wildlife%20Monitoring.pdf?isAllowed=y&sequence=1",
        "title": "Three Decades of Community Science Wildlife Monitoring",
        "date": "undated",
        "locator": "River-reach analysis; turtle species between Barton and Argo dams",
        "scope": "Barton-to-Argo river reach; historical community monitoring",
        "claim": "Named among turtle species reported from this reach. Historical counts are not encounter probabilities.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/spiny-softshell-turtle/adult-1200.webp",
        "thumbnail": "assets/animals/spiny-softshell-turtle/adult-640.webp",
        "description": "One representative adult with species field marks; sexes not shown separately. A broad, flattened turtle with a soft-looking olive or gray shell, often dotted with dark spots, and a long, snorkel-like nose."
      }
    ],
    "image": "assets/animals/spiny-softshell-turtle/adult-640.webp"
  },
  {
    "id": "smallmouth-bass",
    "name": "Smallmouth Bass",
    "scientific": "Micropterus dolomieu",
    "group": "Fish",
    "cue": "A bronze fish with dark vertical bars.",
    "look": "Look for a bronze-olive body, subtle vertical bars, and an upper jaw that reaches about the middle of the eye. Only mark this square with a confident identification.",
    "illustration": "Identification profile. A quick splash is usually not enough to identify a bass.",
    "source": "https://www.michigan.gov/dnr/education/michigan-species/fish-species/smallmouth",
    "occurrence": [
      {
        "url": "https://www.hrwc.org/our-watershed/features/",
        "title": "HRWC — Watershed Features",
        "date": "undated",
        "locator": "Biodiversity, fish list",
        "scope": "Huron main branch",
        "claim": "Names Smallmouth Bass in the river. Pooled Largemouth/Smallmouth Argo sample rows cannot establish Smallmouth alone.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "representative",
        "label": "Representative fish",
        "image": "assets/animals/smallmouth-bass/representative-1200.webp",
        "thumbnail": "assets/animals/smallmouth-bass/representative-640.webp",
        "description": "One representative Smallmouth Bass identification profile. No sex, juvenile or life-stage variants; source diagnostic body, jaw, fin, operculum and bar traits."
      }
    ],
    "image": "assets/animals/smallmouth-bass/representative-640.webp"
  },
  {
    "id": "jumping-fish",
    "name": "Jumping Fish",
    "scientific": "Any fish species",
    "group": "Fish",
    "cue": "See a fish leap clear of the water.",
    "look": "See an actual fish leap clear of the water. You do not need to identify the species. A ripple or unexplained splash alone is not a confirmed fish.",
    "illustration": "Common Carp (Cyprinus carpio), illustrating a behavior. Historical Huron River occurrence and separate jumping evidence do not identify every leap or establish an Argo jumping observation.",
    "source": "https://portal.ct.gov/deep/fishing/freshwater/freshwater-fishes-of-connecticut/common-carp",
    "occurrence": [
      {
        "url": "https://nas.er.usgs.gov/queries/SpecimenViewer.aspx?SpecimenID=159497",
        "title": "USGS specimen record 159497",
        "date": "1922-05-08",
        "locator": "Voucher UMMZ 56004, collected May 8, 1922",
        "scope": "Huron River below Geddes Dam; historical specimen",
        "claim": "Common Carp historically occurred in the Huron River. This is not an Argo jumping observation.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "behavior",
        "label": "Leaping fish",
        "image": "assets/animals/jumping-fish/behavior-1200.webp",
        "thumbnail": "assets/animals/jumping-fish/behavior-640.webp",
        "description": "Common Carp (Cyprinus carpio), illustrating a behavior. Historical Huron River occurrence and separate jumping evidence do not identify every leap or establish an Argo jumping observation."
      }
    ],
    "image": "assets/animals/jumping-fish/behavior-640.webp"
  },
  {
    "id": "common-merganser",
    "name": "Common Merganser",
    "scientific": "Mergus merganser",
    "group": "Birds",
    "cue": "A long, narrow red bill on a diving duck.",
    "look": "Both sexes have a narrow red bill. The male has a dark green head, black back and white body; the female has a rusty head, white chin, and a sharp boundary above the pale breast. Compare other mergansers before deciding.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://www.allaboutbirds.org/guide/Common_Merganser/id/",
    "habitat": "Seasonal challenge; winter waterfowl below Barton Dam.",
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/j50oaedb/barton_nap_brochure.pdf#page=1",
        "title": "City of Ann Arbor — Barton Nature Area brochure",
        "date": "undated",
        "locator": "PDF p. 1, Birds, final winter-waterfowl paragraph",
        "scope": "Below Barton Dam; winter",
        "claim": "Names winter Common Merganser; does not establish summer breeding or frequent rowing-season sightings.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/common-merganser/adult-male-1200.webp",
        "thumbnail": "assets/animals/common-merganser/adult-male-640.webp",
        "description": "Breeding green head/white body, narrow red bill"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/common-merganser/adult-female-1200.webp",
        "thumbnail": "assets/animals/common-merganser/adult-female-640.webp",
        "description": "Gray body/rust crest, white chin"
      }
    ],
    "image": "assets/animals/common-merganser/adult-male-640.webp"
  },
  {
    "id": "eastern-bluebird",
    "name": "Eastern Bluebird",
    "scientific": "Sialia sialis",
    "group": "Birds",
    "cue": "Blue wings and tail with a rusty breast.",
    "look": "Adult males are brighter blue; females have softer gray-blue upperparts but blue in the wings and tail. Young birds have a spotted breast. A warm reddish breast alone is not enough.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://www.allaboutbirds.org/guide/Eastern_Bluebird/id/",
    "habitat": "Shore and open fields; Barton nest-box habitat.",
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/j50oaedb/barton_nap_brochure.pdf#page=1",
        "title": "City of Ann Arbor — Barton Nature Area brochure",
        "date": "undated",
        "locator": "PDF p. 1, Birds, nest-box sentence",
        "scope": "Barton field/nest-box habitat",
        "claim": "Names bluebirds competing with Tree Swallows; no abundance claim over Argo water.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/eastern-bluebird/adult-male-1200.webp",
        "thumbnail": "assets/animals/eastern-bluebird/adult-male-640.webp",
        "description": "Blue above/rust breast"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/eastern-bluebird/adult-female-1200.webp",
        "thumbnail": "assets/animals/eastern-bluebird/adult-female-640.webp",
        "description": "Duller gray-blue/rust breast"
      },
      {
        "id": "juvenile",
        "label": "Spotted young",
        "image": "assets/animals/eastern-bluebird/juvenile-1200.webp",
        "thumbnail": "assets/animals/eastern-bluebird/juvenile-640.webp",
        "description": "Spotted back/chest, blue wing/tail"
      }
    ],
    "image": "assets/animals/eastern-bluebird/adult-male-640.webp"
  },
  {
    "id": "american-goldfinch",
    "name": "American Goldfinch",
    "scientific": "Spinus tristis",
    "group": "Birds",
    "cue": "A small seed-eater with dark wings and pale wingbars.",
    "look": "Look for a short stout bill, dark wings with contrasting pale bars, and a notched tail. Breeding males are bright yellow with a black cap; females and nonbreeding birds are much duller.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://www.allaboutbirds.org/guide/American_Goldfinch/id/",
    "habitat": "Shore vegetation; Barton nature-area evidence.",
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/j50oaedb/barton_nap_brochure.pdf#page=1",
        "title": "City of Ann Arbor — Barton Nature Area brochure",
        "date": "undated",
        "locator": "PDF p. 1, Birds, opening species account",
        "scope": "Barton Nature Area",
        "claim": "Names resident goldfinches. Historical superlatives are not current abundance estimates.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/american-goldfinch/adult-male-1200.webp",
        "thumbnail": "assets/animals/american-goldfinch/adult-male-640.webp",
        "description": "Breeding yellow/black forehead"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/american-goldfinch/adult-female-1200.webp",
        "thumbnail": "assets/animals/american-goldfinch/adult-female-640.webp",
        "description": "Breeding olive/yellow, no male cap"
      },
      {
        "id": "nonbreeding",
        "label": "Nonbreeding appearance",
        "image": "assets/animals/american-goldfinch/nonbreeding-1200.webp",
        "thumbnail": "assets/animals/american-goldfinch/nonbreeding-640.webp",
        "description": "One dull nonbreeding adult appearance, not separate male/female winter variants; source seasonal plumage and diagnostic wing/bill traits."
      }
    ],
    "image": "assets/animals/american-goldfinch/adult-male-640.webp"
  },
  {
    "id": "northern-yellow-warbler",
    "name": "Northern Yellow Warbler",
    "scientific": "Setophaga aestiva",
    "group": "Birds",
    "cue": "A fine-billed yellow bird with a plain face.",
    "look": "Look for a plain face with a dark eye and yellow patches in the tail. Breeding males often have chestnut breast streaks; females and young may lack these. Other yellow birds remain possible.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://www.allaboutbirds.org/guide/Yellow_Warbler/id/",
    "habitat": "Warm season, shrubs. Historical Yellow Warbler record; current-taxon crosswalk is an inference.",
    "aliases": [
      "Yellow Warbler",
      "Setophaga petechia (historical broad species concept)"
    ],
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/lxpdhnpx/fieldoperations_nap_newsletter_2002_summer.pdf#page=1",
        "title": "City NAP Summer 2002 — Park Focus: Bandemer",
        "date": "2002-06",
        "locator": "PDF p. 1, spring birding paragraph",
        "scope": "Bandemer shrubland; historical reach-edge record",
        "claim": "Historical Yellow Warbler occurrence in Bandemer shrubland. Mapping that older broad name to Northern Yellow Warbler is an inference, not a retrospective re-identification.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/northern-yellow-warbler/adult-male-1200.webp",
        "thumbnail": "assets/animals/northern-yellow-warbler/adult-male-640.webp",
        "description": "Yellow/chestnut breast streaks"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/northern-yellow-warbler/adult-female-1200.webp",
        "thumbnail": "assets/animals/northern-yellow-warbler/adult-female-640.webp",
        "description": "Yellow-green, little/no breast streaking"
      }
    ],
    "image": "assets/animals/northern-yellow-warbler/adult-male-640.webp"
  },
  {
    "id": "song-sparrow",
    "name": "Song Sparrow",
    "scientific": "Melospiza melodia",
    "group": "Birds",
    "cue": "A streaked sparrow with a strongly patterned face.",
    "look": "Look for bold breast and flank streaks, a brown-and-gray face pattern and a rounded tail. Streaks often meet in a central breast spot, but that spot is not universal and does not establish the species alone.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://www.allaboutbirds.org/guide/Song_Sparrow/id/",
    "habitat": "Shore vegetation; Barton shrubland evidence.",
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/j50oaedb/barton_nap_brochure.pdf#page=1",
        "title": "City of Ann Arbor — Barton Nature Area brochure",
        "date": "undated",
        "locator": "PDF p. 1, Birds, summer breeding warblers/sparrows sentence",
        "scope": "Barton shrubland",
        "claim": "Names Song Sparrow; no measured encounter probability.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/song-sparrow/adult-1200.webp",
        "thumbnail": "assets/animals/song-sparrow/adult-640.webp",
        "description": "Representative eastern adult Song Sparrow: streaked breast, clear brown/gray facial pattern, conical bill; no juvenile inference."
      }
    ],
    "image": "assets/animals/song-sparrow/adult-640.webp"
  },
  {
    "id": "common-yellowthroat",
    "name": "Common Yellowthroat",
    "scientific": "Geothlypis trichas",
    "group": "Birds",
    "cue": "Yellow throat, olive back, and a male’s black mask.",
    "look": "Males have a black mask with a pale border; females and young lack the mask. Look for a yellow throat contrasting with an olive back and paler belly. A brief yellow flash may leave several candidates.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://www.allaboutbirds.org/guide/Common_Yellowthroat/id/",
    "habitat": "Warm season, dense low vegetation; historical Bandemer record.",
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/lxpdhnpx/fieldoperations_nap_newsletter_2002_summer.pdf#page=1",
        "title": "City NAP Summer 2002 — Park Focus: Bandemer",
        "date": "2002-06",
        "locator": "PDF p. 1, spring birding paragraph",
        "scope": "Bandemer shrubland; historical reach-edge record",
        "claim": "Names Common Yellowthroat in Bandemer shrubland; historical occurrence, not a current detection estimate.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult-male",
        "label": "Male",
        "image": "assets/animals/common-yellowthroat/adult-male-1200.webp",
        "thumbnail": "assets/animals/common-yellowthroat/adult-male-640.webp",
        "description": "Black mask with pale upper border"
      },
      {
        "id": "adult-female",
        "label": "Female",
        "image": "assets/animals/common-yellowthroat/adult-female-1200.webp",
        "thumbnail": "assets/animals/common-yellowthroat/adult-female-640.webp",
        "description": "No mask; brown-olive head, yellow throat"
      }
    ],
    "image": "assets/animals/common-yellowthroat/adult-male-640.webp"
  },
  {
    "id": "cliff-swallow",
    "name": "Cliff Swallow",
    "scientific": "Petrochelidon pyrrhonota",
    "group": "Birds",
    "cue": "A pale rump and a short, nearly square tail.",
    "look": "Look for a pale cinnamon rump, rusty face and usually a pale forehead on a compact swallow. Unlike a Barn Swallow, it lacks long tail streamers. Flight views are useful; young birds vary.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://www.allaboutbirds.org/guide/Cliff_Swallow/id/",
    "habitat": "Warm season, over river; historical M-14 nesting evidence.",
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/pyunb4oz/argo_bandemer.pdf#page=1",
        "title": "City of Ann Arbor — Argo/Bandemer brochure",
        "date": "undated",
        "locator": "PDF p. 1, Bandemer—Wildlife, M-14 nesting paragraph",
        "scope": "M-14 river structure; historical city interpretation",
        "claim": "Names Cliff Swallows nesting at M-14; current colony occupancy is unverified.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/cliff-swallow/adult-1200.webp",
        "thumbnail": "assets/animals/cliff-swallow/adult-640.webp",
        "description": "Representative adult Cliff Swallow: pale cinnamon rump, typical pale forehead, rusty face and squared tail; no juvenile throat variant."
      }
    ],
    "image": "assets/animals/cliff-swallow/adult-640.webp"
  },
  {
    "id": "common-snapping-turtle",
    "name": "Common Snapping Turtle",
    "scientific": "Chelydra serpentina",
    "group": "Turtles",
    "cue": "A heavy head and a long, saw-ridged tail.",
    "look": "Look for the large head, rugged shell and long tail with a raised saw-like ridge. Stay back and never handle a turtle or inspect its underside for this game.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://mdc.mo.gov/discover-nature/field-guide/north-american-snapping-turtle",
    "habitat": "Water and shore; Argo river/pond association.",
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/pyunb4oz/argo_bandemer.pdf#page=1",
        "title": "City of Ann Arbor — Argo/Bandemer brochure",
        "date": "undated",
        "locator": "PDF p. 1, Argo—Wildlife, snapping/painted comparison",
        "scope": "Argo river/pond and banks",
        "claim": "Names snapping turtles; no handling or nest approach is needed.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/common-snapping-turtle/adult-1200.webp",
        "thumbnail": "assets/animals/common-snapping-turtle/adult-640.webp",
        "description": "Representative adult Common Snapping Turtle: heavy head, rough adult carapace, long saw-ridged tail; full tail and all visible limbs. No hatchling or sex variant."
      }
    ],
    "image": "assets/animals/common-snapping-turtle/adult-640.webp"
  },
  {
    "id": "american-bullfrog",
    "name": "American Bullfrog",
    "scientific": "Lithobates catesbeianus",
    "group": "Amphibians",
    "cue": "A large frog with no paired folds down its back.",
    "look": "The skin fold curves around the ear but does not continue as paired ridges down the back. Green or brown color and large size alone cannot distinguish it from Green Frog.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://mdc.mo.gov/discover-nature/field-guide/north-american-bullfrog",
    "habitat": "Warm season, vegetated water edge; direct Argo Pond association. Catalog only.",
    "aliases": [
      "Rana catesbeiana"
    ],
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/pyunb4oz/argo_bandemer.pdf#page=1",
        "title": "City of Ann Arbor — Argo/Bandemer brochure",
        "date": "undated",
        "locator": "PDF p. 1, Argo—Wildlife, opening paragraph",
        "scope": "Argo Pond",
        "claim": "Names bullfrogs in Argo Pond; not every large green frog is a bullfrog.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": false,
    "cardPolicyReason": "Frogs excluded from cards by user preference; retained for identification.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/american-bullfrog/adult-1200.webp",
        "thumbnail": "assets/animals/american-bullfrog/adult-640.webp",
        "description": "Representative adult American Bullfrog: no paired folds down back, fold curves around tympanum; natural adult frog anatomy, no froglet stage."
      }
    ],
    "image": "assets/animals/american-bullfrog/adult-640.webp"
  },
  {
    "id": "green-frog",
    "name": "Green Frog",
    "scientific": "Lithobates clamitans",
    "group": "Amphibians",
    "cue": "A frog with two raised folds down its back.",
    "look": "Look for paired raised folds extending from behind the eyes along the back. Bullfrogs lack these long paired folds. Small frogs or a distant head-only view may remain unresolved.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://mdc.mo.gov/discover-nature/field-guide/north-american-green-frog",
    "habitat": "Bandemer small pond/shore visit; source does not establish main-channel occurrence. Catalog only.",
    "aliases": [
      "Rana clamitans"
    ],
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/pyunb4oz/argo_bandemer.pdf#page=1",
        "title": "City of Ann Arbor — Argo/Bandemer brochure",
        "date": "undated",
        "locator": "PDF p. 1, Bandemer—Wildlife, final sentence",
        "scope": "Bandemer southern small pond/shore",
        "claim": "Names Green Frogs at the small pond; main-channel occurrence is not established by this source.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": false,
    "cardPolicyReason": "Frogs excluded from cards by user preference; retained for identification.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/green-frog/adult-1200.webp",
        "thumbnail": "assets/animals/green-frog/adult-640.webp",
        "description": "Representative adult Green Frog: paired raised dorsolateral folds extending along back, visible tympanum, natural adult proportions; no froglet stage."
      }
    ],
    "image": "assets/animals/green-frog/adult-640.webp"
  },
  {
    "id": "american-toad",
    "name": "American Toad",
    "scientific": "Anaxyrus americanus",
    "group": "Amphibians",
    "cue": "Warty skin and large glands behind the eyes.",
    "look": "Look for a squat toad with warty skin and prominent parotoid glands behind the eyes. One or two large warts per dark back spot help separate American Toad from Fowler’s Toad; a poor view may not resolve them.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://mdc.mo.gov/discover-nature/field-guide/american-toad",
    "habitat": "Spring, Bandemer small pond/shore; catalog only.",
    "aliases": [
      "Bufo americanus"
    ],
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/pyunb4oz/argo_bandemer.pdf#page=1",
        "title": "City of Ann Arbor — Argo/Bandemer brochure",
        "date": "undated",
        "locator": "PDF p. 1, Bandemer—Wildlife, final sentence",
        "scope": "Bandemer southern small pond; spring",
        "claim": "Names spring toad breeding; easy daytime viewing from a shell is not established.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": false,
    "cardPolicyReason": "Amphibians excluded from cards by user preference; retained for identification.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/american-toad/adult-1200.webp",
        "thumbnail": "assets/animals/american-toad/adult-640.webp",
        "description": "Representative adult American Toad: natural warty skin and parotoid glands, source-backed wart pattern; no toadlet or invented sex colors."
      }
    ],
    "image": "assets/animals/american-toad/adult-640.webp"
  },
  {
    "id": "american-mink",
    "name": "American Mink",
    "scientific": "Neogale vison",
    "group": "Mammals",
    "cue": "A sleek brown body and a fully furred tail.",
    "look": "A long, low body, short legs, rounded ears and a furred tapering tail differ from the chunkier beaver and muskrat. A small white chin patch may show. Consider otters and other weasels too.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://mdc.mo.gov/discover-nature/field-guide/american-mink",
    "habitat": "Broader watershed challenge; Argo unverified. Catalog only.",
    "aliases": [
      "Neovison vison",
      "Mustela vison"
    ],
    "occurrence": [
      {
        "url": "https://www.hrwc.org/wp-content/uploads/2015/02/Huron-River-Report-Spring-2015.pdf#page=4",
        "title": "Huron River Report — The American Mink",
        "date": "2015-03",
        "locator": "Printed pp. 1 and 4; Scan the shoreline",
        "scope": "Named watershed/Ann Arbor sites; Argo unverified",
        "claim": "Describes Mill Creek Park in Dexter and names Gallup Park, Kensington and Matthaei; no current reliable Argo location is promised.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": false,
    "cardPolicyReason": "Mixed activity possible; excluded from daylight cards to keep the game practical.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/american-mink/adult-1200.webp",
        "thumbnail": "assets/animals/american-mink/adult-640.webp",
        "description": "Representative adult American Mink: long slender sleek brown body, short legs, long fully furred tapering tail, small rounded ears; no kit proportions."
      }
    ],
    "image": "assets/animals/american-mink/adult-640.webp"
  },
  {
    "id": "red-fox",
    "name": "Red Fox",
    "scientific": "Vulpes vulpes",
    "group": "Mammals",
    "cue": "Pointed ears, dark lower legs, and a white tail tip.",
    "look": "Typical red foxes have a pointed muzzle, large upright ears, dark lower legs and a bushy white-tipped tail. Coat color varies; compare gray fox, coyote and domestic dog before deciding.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://mdc.mo.gov/discover-nature/field-guide/red-fox",
    "habitat": "Shore, dawn/dusk challenge; Bandemer association. Catalog only.",
    "occurrence": [
      {
        "url": "https://www.a2gov.org/parks-and-recreation/parks-and-places/bandemer-park/",
        "title": "City of Ann Arbor — Bandemer Park",
        "date": "undated",
        "locator": "History, surviving-natural-communities paragraph, fauna sentence",
        "scope": "Bandemer riverfront park",
        "claim": "Names red fox; source gives no count, observation date or main-channel claim.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": false,
    "cardPolicyReason": "Mainly dusk/night in this game context; catalog only.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/red-fox/adult-1200.webp",
        "thumbnail": "assets/animals/red-fox/adult-640.webp",
        "description": "Representative adult Red Fox: typical red coat, black lower legs, pointed muzzle, large ears and white tail tip; no kit coat or proportions."
      }
    ],
    "image": "assets/animals/red-fox/adult-640.webp"
  },
  {
    "id": "bluegill",
    "name": "Bluegill",
    "scientific": "Lepomis macrochirus",
    "group": "Fish",
    "cue": "A deep-bodied fish with a small mouth and a black ear flap.",
    "look": "A clear view should show the deep, flattened body, small mouth, long pointed pectoral fin, black opercular flap and dark blotch at the rear of the dorsal fin. Other sunfish and hybrids can look similar.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://www.michigan.gov/dnr/education/michigan-species/fish-species/bluegill",
    "habitat": "Clear-view identification challenge; species-labeled Argo sample from 2020.",
    "occurrence": [
      {
        "url": "https://www.michigan.gov/pfasresponse/investigations/lakes-and-streams/huron-river",
        "title": "Michigan — Huron River PFAS investigation",
        "date": "2020",
        "locator": "Fish sampling results; Argo Pond / 42.29262 / −83.74523 / Bluegill / 2020",
        "scope": "Argo Pond; dated species-labeled sample",
        "claim": "Demonstrates Bluegill presence at sampling time, not abundance, visibility or leap identification.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "representative",
        "label": "Representative fish",
        "image": "assets/animals/bluegill/representative-1200.webp",
        "thumbnail": "assets/animals/bluegill/representative-640.webp",
        "description": "One representative Bluegill identification profile. No sex, juvenile or life-stage variants; source diagnostic body, jaw, fin, operculum and bar traits."
      }
    ],
    "image": "assets/animals/bluegill/representative-640.webp"
  },
  {
    "id": "double-crested-cormorant",
    "name": "Double-crested Cormorant",
    "scientific": "Nannopterum auritum",
    "group": "Birds",
    "cue": "A long-necked diving bird with a hooked bill.",
    "look": "Look for a long neck and tail, a hook-tipped bill and orange-yellow bare throat/face. Adults are dark; immature birds are browner with a pale throat and breast. Wing spreading alone is not diagnostic, and breeding crests need not be visible.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://www.allaboutbirds.org/guide/Double-crested_Cormorant/id/",
    "habitat": "Daylight diving bird; Ann Arbor/Huron watershed evidence, independently verified Argo record absent.",
    "aliases": [
      "Phalacrocorax auritus"
    ],
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/diejss3l/nap_newsletter_2014_spring.pdf#page=3",
        "title": "City NAP Spring 2014 — Birds at South Pond",
        "date": "2014-03",
        "locator": "Printed p. 3, paragraph by Chalmers Creek mouth",
        "scope": "Ann Arbor South Pond; not Argo",
        "claim": "Names Double-crested Cormorant. The user also reports occasional undated local sightings; this separate report is not independent Argo verification.",
        "reviewed": "2026-11-07"
      },
      {
        "url": "https://www.hrwc.org/birds-of-the-watershed/",
        "title": "HRWC — Birds of the watershed",
        "date": "undated",
        "locator": "August, Ford Lake’s North Bay Park",
        "scope": "Huron River watershed; not Argo",
        "claim": "Names cormorants at Ford Lake; no current Argo occurrence claim.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": true,
    "cardPolicyReason": "Eligible daylight observation target; clear identification still required.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/double-crested-cormorant/adult-1200.webp",
        "thumbnail": "assets/animals/double-crested-cormorant/adult-640.webp",
        "description": "Representative adult, sexes similar: dark long-necked diving bird, long hooked bill, orange-yellow bare throat/lores, long tail and webbed feet; no permanent large crest."
      },
      {
        "id": "juvenile",
        "label": "Brown immature with pale throat/breast",
        "image": "assets/animals/double-crested-cormorant/juvenile-1200.webp",
        "thumbnail": "assets/animals/double-crested-cormorant/juvenile-640.webp",
        "description": "Distinct brown immature with conspicuously paler throat/breast, hooked bill and orange-yellow facial skin, long neck/tail. Appearance overlaps ages; no exact age/sex claim."
      }
    ],
    "image": "assets/animals/double-crested-cormorant/adult-640.webp"
  },
  {
    "id": "american-woodcock",
    "name": "American Woodcock",
    "scientific": "Scolopax minor",
    "group": "Birds",
    "cue": "A plump ground bird with a very long straight bill.",
    "look": "Look for a rounded body, short legs, high-set eyes, barred crown and buff-orange underparts. Wilson’s Snipe is a real lookalike; compare shape and head pattern. A call alone is not a visual sighting.",
    "illustration": "Representative generated recognition art; natural variation and hidden marks remain possible.",
    "source": "https://www.allaboutbirds.org/guide/American_Woodcock/id/",
    "habitat": "Shore challenge; Barton fields at early-spring dusk. Catalog only.",
    "occurrence": [
      {
        "url": "https://www.a2gov.org/media/j50oaedb/barton_nap_brochure.pdf#page=1",
        "title": "City of Ann Arbor — Barton Nature Area brochure",
        "date": "undated",
        "locator": "PDF p. 1, Birds, early-spring sunset/display passage",
        "scope": "Barton central open fields; dusk",
        "claim": "Names woodcock displays. Sound/display evidence does not guarantee a close visual sighting.",
        "reviewed": "2026-11-07"
      }
    ],
    "bingoEligible": false,
    "cardPolicyReason": "Dusk display/ground bird; catalog only.",
    "forms": [
      {
        "id": "adult",
        "label": "Adult",
        "image": "assets/animals/american-woodcock/adult-1200.webp",
        "thumbnail": "assets/animals/american-woodcock/adult-640.webp",
        "description": "Representative adult American Woodcock: plump short-legged body, very long straight bill, high-set eyes, barred crown, buff underparts; no juvenile proportions."
      }
    ],
    "image": "assets/animals/american-woodcock/adult-640.webp"
  }
];
  return Object.freeze(animals.map(animal => Object.freeze({
    ...animal,
    forms: Object.freeze(animal.forms.map(Object.freeze)),
    occurrence: Object.freeze(animal.occurrence.map(Object.freeze)),
    aliases: Object.freeze(animal.aliases || [])
  })));
});
