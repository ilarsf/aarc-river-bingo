(function (root, factory) {
  const graph = factory();
  if (typeof module === 'object' && module.exports) module.exports = graph;
  else root.RiverBingoIdentification = graph;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // Candidate routes follow the source-reviewed discriminators in
  // docs/next-version-plan.md. A route narrows choices; it never certifies an ID.
  const route = (label, next) => ({ label, next });
  const result = (label, candidates, note) => ({ label, candidates, note });
  const nodes = {
    start: {
      question: 'What could you clearly see?',
      answers: [
        route('A bird', 'bird-shape'),
        route('A shell', 'turtle'),
        route('Fur', 'mammal'),
        route('A frog or toad', 'amphibian'),
        route('A fish or a leap', 'fish-or-leap')
      ]
    },
    'bird-shape': {
      question: 'Which bird shape or behavior fits best?',
      note: 'Use the real animal’s shape. Illustration size is not to scale.',
      answers: [
        route('Goose or swan: large body and long neck', 'goose-swan'),
        route('Duck: swimming bird with a broad or narrow bill', 'duck'),
        route('Long legs and a long pointed bill', 'heron'),
        route('Large bird soaring overhead', 'soaring'),
        route('Small bird catching insects in flight', 'aerial'),
        route('Crested bird with a heavy pointed bill', 'kingfisher'),
        route('Long-necked diving bird with a hooked bill', 'cormorant'),
        route('Small bird perched or in vegetation', 'small-bird'),
        route('Plump ground bird with a very long bill', 'woodcock')
      ]
    },
    'goose-swan': {
      question: 'Which head and bill marks did you see?',
      answers: [
        result('Black head/neck with a white chinstrap', ['canada-goose'], 'Canada Goose candidate. Check the chinstrap, brown body and structure together.'),
        result('Orange bill with a black basal knob', ['mute-swan'], 'Adult Mute Swan candidate. A white body or curved neck alone is insufficient.'),
        result('Downy or gray young; adult marks absent', ['canada-goose', 'mute-swan'], 'Compare young forms and nearby adults without assuming parentage. Other geese, and Trumpeter or Tundra Swans, remain possible; a gray young swan may stay unresolved.')
      ]
    },
    duck: {
      question: 'What did the bill and face look like?',
      answers: [
        result('Long, narrow red bill', ['common-merganser'], 'Check structure first. A rusty-headed female should have a white chin and sharp neck-color boundary. Hooded and Red-breasted Mergansers remain possible.'),
        result('Broad bill; green head and white neck ring', ['mallard'], 'Breeding male Mallard candidate. Check yellow bill and chestnut breast; domestic and hybrid ducks can overlap.'),
        result('Broad bill; ornate crest or a white eye teardrop', ['wood-duck'], 'Male Wood Duck has ornate white face lines; female has a white eye-ring extended behind the eye.'),
        result('Broad bill; mottled brown or downy young', ['mallard', 'wood-duck'], 'Compare bill pattern, face markings and, when visible, wing patch. Female Mallard has an orange/dark bill and white-bordered blue speculum. Young and nonbreeding ducks are not forced through breeding-male colors; other ducks remain possible.')
      ]
    },
    heron: {
      question: 'Which combination of body and leg marks fits?',
      answers: [
        result('Tall and blue-gray, with a long dagger bill', ['great-blue-heron'], 'Great Blue Heron candidate. Young birds lack the mature head plumes. Herons retract their necks in flight.'),
        result('Compact; greenish back and chestnut neck', ['green-heron'], 'Adult Green Heron candidate. Check the stocky shape and short-looking legs along with color.'),
        result('Compact and brown/streaked', ['green-heron'], 'Young Green Heron candidate. Compare the streaked form and guide; other young wading birds are possible.'),
        result('All white, yellow bill, black legs and feet', ['great-egret'], 'Great Egret candidate. White plumage alone is insufficient; Snowy Egret and other white birds remain possible.')
      ]
    },
    soaring: {
      question: 'What combination was visible in flight?',
      answers: [
        result('Pale underside, dark eye stripe, angled long wings', ['osprey'], 'Osprey candidate. Flight shape helps narrow choices; check the face stripe and pale underside if the view permits.'),
        result('White head and tail, dark body, huge bill', ['bald-eagle'], 'Adult Bald Eagle candidate. A tiny distant pale head alone is insufficient.'),
        result('Broad wings and a rusty tail', ['red-tailed-hawk'], 'Adult Red-tailed Hawk candidate. Tail and belly markings vary; compare a clear view.'),
        result('Teetering shallow V; pale flight feathers below', ['turkey-vulture'], 'Turkey Vulture candidate. Dark forewings contrast with paler flight feathers. Young birds have dark heads; a red head is not required.'),
        result('Brown or mottled; adult head/tail colors absent', ['bald-eagle', 'red-tailed-hawk', 'turkey-vulture', 'osprey'], 'Compare young forms, wing proportions and underwing patterns. Young eagles are brown/mottled; young Red-tailed Hawks have barred tails. Other raptors and vultures remain possible; distant shape alone may not resolve the ID.')
      ]
    },
    aerial: {
      question: 'What could you see of the belly and tail?',
      note: 'Use flight photographs in the linked ID guides as well as the generated portraits.',
      references: [
        { title: 'Tree Swallow flight views', url: 'https://www.allaboutbirds.org/guide/Tree_Swallow/id/' },
        { title: 'Cliff Swallow flight views', url: 'https://www.allaboutbirds.org/guide/Cliff_Swallow/id/' },
        { title: 'Chimney Swift flight views', url: 'https://www.allaboutbirds.org/guide/Chimney_Swift/id/' }
      ],
      answers: [
        result('White belly; short, slightly notched tail', ['tree-swallow'], 'Tree Swallow candidate. Blue-green and brown upperparts both fit; brown appearance alone cannot establish age or sex.'),
        result('Pale cinnamon rump; rusty face; nearly square tail', ['cliff-swallow'], 'Cliff Swallow candidate. Typical local adults often have a pale forehead; young birds vary.'),
        result('Sooty cigar-shaped body; curved wings; very short tail', ['chimney-swift'], 'Chimney Swift candidate. It lacks a broad bright white belly.'),
        result('Long tail streamers', [], 'None of these three fits well. Barn Swallow is an outside-catalog possibility; compare a guide before deciding.')
      ]
    },
    kingfisher: {
      question: 'Was there a shaggy crest, white collar and blue-gray chest band?',
      answers: [
        result('Yes, with a heavy straight pointed bill', ['belted-kingfisher'], 'Belted Kingfisher candidate. Female additionally has a rusty belly band; absence of that band does not reject a male.'),
        result('Only a perched silhouette was clear', [], 'Not enough detail. A silhouette without the collar, band or bill marks is insufficient for this result.')
      ]
    },
    cormorant: {
      question: 'Did you see a hook-tipped bill and orange-yellow bare face/throat?',
      answers: [
        result('Yes; long neck and tail, dark body', ['double-crested-cormorant'], 'Adult Double-crested Cormorant candidate. Crests need not show outside breeding condition; wing spreading is not unique to this species.'),
        result('Yes; browner body with pale throat/breast', ['double-crested-cormorant'], 'Immature Double-crested Cormorant candidate. Compare the pale-throated form. Check loons, mergansers and rare other cormorants before deciding.'),
        result('Only diving or wing spreading was clear', [], 'Not enough detail. Diving and wing spreading alone do not identify a species.')
      ]
    },
    woodcock: {
      question: 'Could you see a plump body, short legs, high eyes and barred crown?',
      answers: [
        result('Yes, with a very long straight bill and buff underside', ['american-woodcock'], 'American Woodcock candidate. Wilson’s Snipe is an outside-catalog lookalike; compare body shape and crown pattern in a clear view.'),
        result('Only a call or distant display', [], 'Not enough detail for a visual sighting. A call mnemonic does not establish that you saw the bird.')
      ]
    },
    'small-bird': {
      question: 'Which combination did you see?',
      answers: [
        result('Orange/black or yellow-orange; pointed bill and pale wing marks', ['baltimore-oriole'], 'Male Baltimore Orioles are black and orange; females and young are softer yellow-orange. Check structure and wing pattern together.'),
        result('Conical bill; red shoulder patch or strong streaks/pale eyebrow', ['red-winged-blackbird', 'song-sparrow'], 'Male Red-winged Blackbird has red/yellow epaulets; female is streaked with a pale eyebrow. Streaked sparrows can overlap; compare face pattern, bill and proportions.'),
        result('Blue wings/tail; rusty or spotted breast', ['eastern-bluebird'], 'Eastern Bluebird candidate. Females are softer gray-blue; young have spotted breasts. Check blue wings/tail, not breast color alone.'),
        result('Stout seed bill; contrasting wingbars and notched tail', ['american-goldfinch'], 'American Goldfinch candidate. Females and winter birds lack the bright male yellow-and-black appearance. Other finches are possible.'),
        result('Fine bill; plain yellow face or yellow throat/olive back', ['northern-yellow-warbler', 'common-yellowthroat'], 'Compare yellow distribution and tail patches. Male Northern Yellow Warbler may have chestnut streaks; females may lack them. Male yellowthroat has a black mask; female does not. Other warblers remain possible.'),
        result('Strong breast streaks and a brown/gray face pattern', ['song-sparrow', 'red-winged-blackbird'], 'Song Sparrow often has a central breast spot, but it is not universal. Female Red-winged Blackbird and other sparrows can overlap; check multiple marks.'),
        result('Brown or muted female/young; markings incomplete', ['baltimore-oriole', 'red-winged-blackbird', 'eastern-bluebird', 'american-goldfinch', 'northern-yellow-warbler', 'song-sparrow', 'common-yellowthroat'], 'Not enough detail for a single answer. Compare the available forms and positive cues; the catalog does not include every local small bird.')
      ]
    },
    turtle: {
      question: 'What shell, snout or tail marks were visible?',
      answers: [
        result('Flat leathery disc and a tubular snout', ['spiny-softshell-turtle'], 'Spiny Softshell candidate. Check the shell texture and snout together; do not approach or handle it.'),
        result('Heavy head and a long saw-ridged tail', ['common-snapping-turtle'], 'Common Snapping Turtle candidate. Observe from a distance; no underside inspection or handling is needed.'),
        result('Hard shell with red/orange edge marks and striped head/limbs', ['painted-turtle'], 'Painted Turtle candidate. A red stripe behind the eye instead suggests a slider outside this catalog.'),
        result('Fine yellow map pattern and a yellow spot behind the eye', ['common-map-turtle'], 'Common/Northern Map Turtle candidate. Fine markings can be unresolved from a boat.'),
        result('A red stripe behind the eye', [], 'A slider outside this catalog is possible. Shell color alone does not identify Painted Turtle.')
      ]
    },
    mammal: {
      question: 'Which body or tail combination was visible?',
      answers: [
        result('Stocky swimmer; broad flat paddle tail', ['american-beaver'], 'American Beaver candidate. A swimming head alone cannot reliably separate beaver, muskrat and other mammals.'),
        result('Compact swimmer; narrow almost bare tail', ['muskrat'], 'Muskrat candidate. Check the narrow tail and body together rather than apparent size alone.'),
        result('Long slender body; short legs; fully furred tapering tail', ['american-mink'], 'American Mink candidate. A small white chin patch may show; otters and other weasels remain possible.'),
        result('Hooves, long legs and a white tail underside', ['white-tailed-deer'], 'White-tailed Deer candidate. Bucks, does and spotted fawns all qualify; antlerless does not automatically mean female.'),
        result('Black mask and alternating dark/pale tail rings', ['raccoon'], 'Raccoon candidate. Check the mask and heavily furred ringed tail together.'),
        result('Pointed muzzle/ears; dark lower legs; white tail tip', ['red-fox'], 'Red Fox candidate. Coat color varies; check gray fox, coyote and domestic dog too.'),
        result('Only a swimming head', [], 'Not enough detail. Beaver, muskrat, mink and other mammals may be unresolved without body or tail marks.')
      ]
    },
    amphibian: {
      question: 'What skin or back-fold pattern did you see?',
      answers: [
        result('Warty skin and large glands behind the eyes', ['american-toad'], 'American Toad candidate. One or two large warts per dark back spot help separate it from Fowler’s Toad; a poor view may remain unresolved.'),
        result('Paired raised folds extending along the back', ['green-frog'], 'Green Frog candidate. Green/brown color and size alone do not separate it from bullfrog.'),
        result('Fold around the ear; no paired folds down the back', ['american-bullfrog'], 'American Bullfrog candidate. Check the full fold pattern in a clear view; do not rely on size alone.'),
        result('Small frog or only a green/brown head', [], 'Not enough detail. Young frogs use the same back-fold distinction; unresolved small frogs stay unresolved.')
      ]
    },
    'fish-or-leap': {
      question: 'What did you actually see?',
      answers: [
        result('A fish visibly left the water', ['jumping-fish'], 'The behavior qualifies without naming the fish. The Common Carp illustration is one documented Huron River fish, not an identification of every leap.'),
        route('A clear view of the whole fish and its marks', 'fish-species'),
        result('Only a splash, ripple or brief silver flash', [], 'Not enough detail. A splash alone does not establish Jumping Fish or identify Smallmouth Bass.')
      ]
    },
    'fish-species': {
      question: 'Which body and mouth marks were clear?',
      answers: [
        result('Elongated bronze body, vertical bars, jaw ends near mid-eye', ['smallmouth-bass'], 'Smallmouth Bass candidate. These marks require a clear view; a leap does not answer this question.'),
        result('Deep body, small mouth, black ear flap and rear dorsal blotch', ['bluegill'], 'Bluegill candidate. Check the pointed pectoral fin too; other sunfish and hybrids remain possible.')
      ]
    }
  };
  for (const node of Object.values(nodes)) {
    node.answers.push(
      result('Not sure', [], 'Not enough detail. You can go back, compare the catalog, or leave this sighting unrecorded.'),
      result('None of these', [], 'Other real local species are possible outside this catalog. Keep the observation unresolved if the visible marks do not fit.')
    );
    node.answers = Object.freeze(node.answers.map(answer => Object.freeze({ ...answer,
      ...(answer.candidates ? { candidates: Object.freeze(answer.candidates) } : {})
    })));
    if (node.references) node.references = Object.freeze(node.references.map(Object.freeze));
    Object.freeze(node);
  }
  return Object.freeze({ start: 'start', nodes: Object.freeze(nodes) });
});
