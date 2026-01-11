export interface ChapterData {
  number: number;
  title: string;
  openingLine: string;
  summary: string;
  keyEvents: string[];
  themes: string[];
  charactersIntroduced: string[];
  charactersDied: string[];
  quote: string;
  quoteAttribution?: string;
  era: string;
  mood: 'hopeful' | 'turbulent' | 'magical' | 'melancholic' | 'apocalyptic';
}

export const chaptersData: ChapterData[] = [
  {
    number: 1,
    title: "The Discovery of Ice",
    openingLine: "Many years later, as he faced the firing squad, Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice.",
    summary: "José Arcadio Buendía founds Macondo, a village isolated from the world. Enchanted by the gypsies' inventions—magnets, telescopes, magnifying glasses—he becomes obsessed with science and alchemy. The gypsy Melquíades brings knowledge and wonder, while Úrsula holds the family together with practical wisdom.",
    keyEvents: [
      "Founding of Macondo",
      "Arrival of Melquíades and the gypsies",
      "José Arcadio Buendía's scientific obsessions begin",
      "The discovery of ice"
    ],
    themes: ["Wonder", "Isolation", "The pursuit of knowledge", "Beginnings"],
    charactersIntroduced: ["jose-arcadio-buendia", "ursula", "melquiades"],
    charactersDied: [],
    quote: "Things have a life of their own. It's simply a matter of waking up their souls.",
    quoteAttribution: "Melquíades",
    era: "~1820s",
    mood: "magical"
  },
  {
    number: 2,
    title: "The Pig's Tail",
    openingLine: "When the pirate Sir Francis Drake attacked Riohacha in the sixteenth century...",
    summary: "The history of the Buendía and Iguarán families is revealed—cousins who married despite warnings of producing children with pig's tails. José Arcadio Buendía kills Prudencio Aguilar in a duel, and haunted by his ghost, leads his family across the mountains to found Macondo. Young José Arcadio discovers desire with Pilar Ternera.",
    keyEvents: [
      "Origin story of the Buendía-Iguarán marriage",
      "The killing of Prudencio Aguilar",
      "The exodus to found Macondo",
      "José Arcadio's affair with Pilar Ternera begins"
    ],
    themes: ["Fate", "Guilt", "Forbidden love", "The family curse"],
    charactersIntroduced: ["jose-arcadio-son", "colonel-aureliano", "pilar-ternera"],
    charactersDied: [],
    quote: "If you bear iguanas, we'll raise iguanas. But there'll be no more killings in this town because of you.",
    quoteAttribution: "José Arcadio Buendía",
    era: "~1830s",
    mood: "turbulent"
  },
  {
    number: 3,
    title: "The Plague of Insomnia",
    openingLine: "Rebeca arrived in March...",
    summary: "The orphan Rebeca arrives carrying her parents' bones and bringing the insomnia plague that erases memory. The town forgets the names of things and must label everything. Melquíades returns from death itself to cure them. Amaranta is born, and rivalry with Rebeca begins over the Italian Pietro Crespi.",
    keyEvents: [
      "Arrival of Rebeca with her parents' bones",
      "The insomnia plague strikes Macondo",
      "Melquíades returns from death to cure the plague",
      "Pietro Crespi arrives, sparking rivalry"
    ],
    themes: ["Memory and forgetting", "Death and resurrection", "Jealousy"],
    charactersIntroduced: ["rebeca", "amaranta"],
    charactersDied: [],
    quote: "This is the plague of insomnia... The worst part of it is not being unable to sleep, but the eventual forgetting.",
    era: "~1840s",
    mood: "magical"
  },
  {
    number: 4,
    title: "The Civil Wars Begin",
    openingLine: "Aureliano was the first human being to be born in Macondo...",
    summary: "Colonel Aureliano falls in love with the child Remedios Moscote and marries her. Political tensions rise as Conservatives and Liberals clash. The seeds of civil war are planted. José Arcadio returns transformed—enormous, tattooed, having traveled the world.",
    keyEvents: [
      "Aureliano marries the child Remedios Moscote",
      "José Arcadio returns from his travels, transformed",
      "Political conflicts begin in Macondo",
      "Arcadio is born to Pilar Ternera"
    ],
    themes: ["Innocence lost", "Political awakening", "Transformation"],
    charactersIntroduced: ["remedios-moscote", "arcadio"],
    charactersDied: [],
    quote: "He was unable to bear in his soul the crushing weight of so much past.",
    era: "~1850s",
    mood: "turbulent"
  },
  {
    number: 5,
    title: "The War Continues",
    openingLine: "Colonel Aureliano Buendía organized thirty-two armed uprisings and he lost them all.",
    summary: "The civil war consumes Aureliano, who becomes the legendary Colonel. Remedios dies young, taking his capacity for love with her. José Arcadio marries Rebeca and is later found dead, shot mysteriously. Aureliano's seventeen illegitimate sons are born across the war-torn country.",
    keyEvents: [
      "Colonel Aureliano launches his military campaigns",
      "Death of Remedios Moscote",
      "José Arcadio marries Rebeca",
      "Mysterious death of José Arcadio"
    ],
    themes: ["War and its futility", "Loss", "The corruption of ideals"],
    charactersIntroduced: ["aureliano-jose"],
    charactersDied: ["remedios-moscote", "jose-arcadio-son"],
    quote: "He had to start thirty-two wars and had to violate all his pacts with death... to discover the privileges of simplicity.",
    era: "~1860s",
    mood: "turbulent"
  },
  {
    number: 6,
    title: "The Tree of Madness",
    openingLine: "José Arcadio Buendía, who had recovered his madness...",
    summary: "José Arcadio Buendía descends into madness, speaking only in Latin, and is tied to the chestnut tree where he will remain until death. Melquíades dies again, this time for good, leaving behind his cryptic manuscripts. The war drags on.",
    keyEvents: [
      "José Arcadio Buendía goes mad",
      "He is tied to the chestnut tree",
      "Death of Melquíades",
      "The war continues"
    ],
    themes: ["Madness", "Mortality", "The weight of knowledge"],
    charactersIntroduced: [],
    charactersDied: ["jose-arcadio-buendia", "melquiades"],
    quote: "He really had been through death, but he had returned because he could not bear the solitude.",
    quoteAttribution: "On Melquíades",
    era: "~1870s",
    mood: "melancholic"
  },
  {
    number: 7,
    title: "Arcadio's Tyranny",
    openingLine: "Arcadio was one of the first to leave...",
    summary: "Left in charge of Macondo, Arcadio becomes a cruel tyrant. His reign of terror ends when Conservative forces retake the town and execute him by firing squad. Before dying, he discovers his true parentage and legitimizes his children with Santa Sofía de la Piedad.",
    keyEvents: [
      "Arcadio's brutal rule of Macondo",
      "His relationship with Santa Sofía de la Piedad",
      "Execution of Arcadio by firing squad",
      "Birth of Remedios the Beauty and the twins"
    ],
    themes: ["Power corrupts", "Identity", "Justice and revenge"],
    charactersIntroduced: ["santa-sofia"],
    charactersDied: ["arcadio"],
    quote: "Shooting is not a punishment but a relief.",
    quoteAttribution: "Arcadio, facing execution",
    era: "~1880s",
    mood: "turbulent"
  },
  {
    number: 8,
    title: "The Twins",
    openingLine: "The twins, José Arcadio Segundo and Aureliano Segundo, were so alike...",
    summary: "The identical twins José Arcadio Segundo and Aureliano Segundo grow up, possibly switched at childhood. Aureliano Segundo discovers that his love for Petra Cotes causes animals to multiply miraculously. Remedios the Beauty grows into the most beautiful woman ever seen.",
    keyEvents: [
      "The twins grow up, possibly switched in identity",
      "Aureliano Segundo's affair with Petra Cotes",
      "The miraculous multiplication of animals",
      "Remedios the Beauty comes of age"
    ],
    themes: ["Identity and doubles", "Prosperity", "Supernatural beauty"],
    charactersIntroduced: ["remedios-la-bella", "aureliano-segundo", "jose-arcadio-segundo", "petra-cotes"],
    charactersDied: [],
    quote: "She emitted a breath of perturbation, a tormented breeze that was still perceptible several hours after she had passed by.",
    quoteAttribution: "On Remedios the Beauty",
    era: "~1890s",
    mood: "magical"
  },
  {
    number: 9,
    title: "The Seventeen Aurelianos",
    openingLine: "The seventeen sons of Colonel Aureliano Buendía...",
    summary: "Colonel Aureliano's seventeen illegitimate sons arrive in Macondo, all marked with ash crosses on their foreheads. They will all be hunted down and killed one by one. Aureliano José dies in his forbidden pursuit of his aunt Amaranta.",
    keyEvents: [
      "Arrival of the seventeen Aurelianos",
      "The systematic killing of the Colonel's sons begins",
      "Death of Aureliano José",
      "Colonel Aureliano's increasing isolation"
    ],
    themes: ["Fate", "The sins of the father", "Forbidden desire"],
    charactersIntroduced: [],
    charactersDied: ["aureliano-jose"],
    quote: "He was condemned not to know love.",
    era: "~1900s",
    mood: "melancholic"
  },
  {
    number: 10,
    title: "Fernanda Arrives",
    openingLine: "Fernanda del Carpio was chosen to be Queen...",
    summary: "Aureliano Segundo marries Fernanda del Carpio, a woman raised to be a queen in a decaying aristocratic family. Her rigid Catholic morality clashes with the Buendía spirit. She brings order and repression to the household.",
    keyEvents: [
      "Aureliano Segundo meets Fernanda at carnival",
      "Marriage of Aureliano Segundo and Fernanda",
      "Fernanda imposes her rigid rules on the household",
      "Birth of José Arcadio (the future seminarian)"
    ],
    themes: ["Class", "Religion vs. freedom", "Marriage as conflict"],
    charactersIntroduced: ["fernanda"],
    charactersDied: [],
    quote: "She had been raised to be a queen... In a household where there was nothing to eat, she learned to embroider gold thread.",
    era: "~1910s",
    mood: "turbulent"
  },
  {
    number: 11,
    title: "The Banana Company",
    openingLine: "The banana company had arrived...",
    summary: "The American banana company arrives, transforming Macondo into a boom town. Modernity invades—electricity, cinema, trains. But the company brings exploitation and the seeds of disaster. José Arcadio Segundo becomes a union organizer.",
    keyEvents: [
      "Arrival of the banana company",
      "Modernization of Macondo",
      "José Arcadio Segundo organizes workers",
      "Growing labor tensions"
    ],
    themes: ["Imperialism", "Progress and its costs", "Labor exploitation"],
    charactersIntroduced: [],
    charactersDied: [],
    quote: "Look at the mess we've got ourselves into, just because we invited a gringo to eat some bananas.",
    era: "~1915",
    mood: "turbulent"
  },
  {
    number: 12,
    title: "Remedios Ascends",
    openingLine: "Remedios the Beauty stayed there wandering through the desert of solitude...",
    summary: "Remedios the Beauty, untouched by earthly desires, ascends bodily into heaven while folding sheets in the garden. Her unearthly beauty has caused the deaths of multiple men who glimpsed her. Meme falls in love with Mauricio Babilonia.",
    keyEvents: [
      "Remedios the Beauty ascends to heaven",
      "Deaths caused by her supernatural beauty",
      "Meme's secret love affair with Mauricio Babilonia",
      "The yellow butterflies that follow Mauricio"
    ],
    themes: ["Transcendence", "Forbidden love", "The supernatural"],
    charactersIntroduced: ["renata-remedios", "mauricio-babilonia"],
    charactersDied: ["remedios-la-bella"],
    quote: "Remedios the Beauty waved goodbye in the midst of the flapping sheets that rose up with her.",
    era: "~1918",
    mood: "magical"
  },
  {
    number: 13,
    title: "The Colonel's Death",
    openingLine: "Colonel Aureliano Buendía spent the final years of his life...",
    summary: "Colonel Aureliano Buendía, having lost all thirty-two wars and all capacity for love, spends his final years making little gold fish, melting them down, and making them again. He dies urinating against the chestnut tree, forgotten by history.",
    keyEvents: [
      "The Colonel's final, solitary years",
      "His endless making of gold fish",
      "Death of Colonel Aureliano Buendía",
      "The world forgets his wars"
    ],
    themes: ["Futility", "Solitude", "The cycles of repetition"],
    charactersIntroduced: ["jose-arcadio-iii"],
    charactersDied: ["colonel-aureliano"],
    quote: "He had had to start thirty-two wars and win them all, only to discover the privileges of simplicity.",
    era: "~1920",
    mood: "melancholic"
  },
  {
    number: 14,
    title: "Meme's Love",
    openingLine: "Meme was in the last year at school...",
    summary: "Meme (Renata Remedios) falls deeply in love with Mauricio Babilonia, a mechanic perpetually surrounded by yellow butterflies. Fernanda discovers the affair and has Mauricio shot as a chicken thief, paralyzing him. Meme is sent to a convent, pregnant.",
    keyEvents: [
      "Meme's secret romance with Mauricio",
      "Yellow butterflies reveal their meetings",
      "Mauricio is shot and paralyzed",
      "Meme sent to convent, never to speak again"
    ],
    themes: ["Forbidden love", "Maternal cruelty", "Silence as punishment"],
    charactersIntroduced: [],
    charactersDied: [],
    quote: "The butterflies preceded him wherever he went.",
    quoteAttribution: "On Mauricio Babilonia",
    era: "~1925",
    mood: "turbulent"
  },
  {
    number: 15,
    title: "The Massacre",
    openingLine: "The events that would deal Macondo its fatal blow...",
    summary: "The banana workers strike. Three thousand workers and their families gather at the station. The army opens fire, massacring them all. José Arcadio Segundo survives by hiding among the corpses. The government denies the massacre ever happened. Then the rain begins.",
    keyEvents: [
      "The workers' strike against the banana company",
      "The massacre at the train station",
      "José Arcadio Segundo's survival and trauma",
      "The government's denial of the massacre",
      "Deaths of Aureliano Segundo and José Arcadio Segundo"
    ],
    themes: ["State violence", "Historical amnesia", "Trauma"],
    charactersIntroduced: [],
    charactersDied: ["aureliano-segundo", "jose-arcadio-segundo", "amaranta"],
    quote: "You must have been dreaming. Nothing has happened in Macondo.",
    era: "~1928",
    mood: "apocalyptic"
  },
  {
    number: 16,
    title: "The Rain",
    openingLine: "It rained for four years, eleven months, and two days...",
    summary: "The rain falls for four years, eleven months, and two days. Macondo rots. The banana company leaves. Aureliano Babilonia arrives as a baby in a basket—Meme's secret son. The house decays as Fernanda tries to maintain appearances.",
    keyEvents: [
      "The four-year rain begins",
      "Decay of Macondo and the Buendía house",
      "Arrival of Aureliano Babilonia",
      "Death of Mauricio Babilonia",
      "The banana company abandons Macondo"
    ],
    themes: ["Decay", "Endurance", "The end of an era"],
    charactersIntroduced: ["aureliano-babilonia"],
    charactersDied: ["mauricio-babilonia"],
    quote: "It rained for four years, eleven months, and two days.",
    era: "~1932",
    mood: "apocalyptic"
  },
  {
    number: 17,
    title: "Úrsula's Death",
    openingLine: "Úrsula had to make a great effort to fulfill her promise to die...",
    summary: "Úrsula, having lived well past one hundred years, shrinks to the size of a doll before finally dying. With her death, the soul of the house dies. Fernanda rules over the ruins with iron will and delusion. Aureliano Babilonia grows up in isolation.",
    keyEvents: [
      "Úrsula shrinks and finally dies",
      "The house falls further into ruin",
      "Fernanda's delusional rule",
      "Death of Fernanda",
      "Aureliano Babilonia's solitary education"
    ],
    themes: ["The end of matriarchy", "Memory", "Decay"],
    charactersIntroduced: [],
    charactersDied: ["ursula", "fernanda"],
    quote: "She spent her final months feeling her way through the house, trying to hold onto the remnants of her family.",
    era: "~1940",
    mood: "melancholic"
  },
  {
    number: 18,
    title: "The Decay",
    openingLine: "Amaranta Úrsula returned with her husband...",
    summary: "Amaranta Úrsula returns from Europe with her Belgian husband Gastón, determined to restore the house and Macondo. She brings modern spirit but cannot reverse the decay. The old magic has left the world.",
    keyEvents: [
      "Return of Amaranta Úrsula from Europe",
      "Her marriage to Gastón",
      "Attempts to restore the house",
      "Death of Rebeca, alone and forgotten"
    ],
    themes: ["Homecoming", "Futile restoration", "The old vs. new world"],
    charactersIntroduced: ["amaranta-ursula", "gaston"],
    charactersDied: ["rebeca"],
    quote: "She was the only one who did not have a heart of stone.",
    era: "~1950",
    mood: "hopeful"
  },
  {
    number: 19,
    title: "The Decline",
    openingLine: "Aureliano Babilonia finished deciphering the parchments...",
    summary: "Aureliano Babilonia and Amaranta Úrsula, not knowing they are aunt and nephew, fall passionately in love. Gastón leaves. They live in delirious happiness as the house crumbles around them. José Arcadio returns from Rome, corrupt, and is drowned by children he had abused.",
    keyEvents: [
      "Incestuous love between Aureliano and Amaranta Úrsula",
      "Gastón abandons Amaranta Úrsula",
      "Return and death of José Arcadio",
      "The final passion in the ruined house"
    ],
    themes: ["Forbidden love", "The family curse fulfilled", "Decadence"],
    charactersIntroduced: [],
    charactersDied: ["jose-arcadio-iii", "santa-sofia"],
    quote: "They loved each other with the quiet, routine love of an old married couple.",
    era: "~1960",
    mood: "turbulent"
  },
  {
    number: 20,
    title: "The End",
    openingLine: "Before reaching the final line, however...",
    summary: "Amaranta Úrsula gives birth to the last Buendía—a child with a pig's tail. She dies in childbirth. Aureliano, in grief, finally deciphers Melquíades' manuscripts: they contain the entire history of the family. As he reads, a biblical wind destroys Macondo forever.",
    keyEvents: [
      "Birth of the last Buendía with a pig's tail",
      "Death of Amaranta Úrsula in childbirth",
      "The baby is eaten by ants",
      "Aureliano deciphers the manuscripts",
      "A hurricane destroys Macondo"
    ],
    themes: ["Prophecy fulfilled", "The end of time", "Solitude eternal"],
    charactersIntroduced: ["aureliano-pig-tail"],
    charactersDied: ["amaranta-ursula", "aureliano-babilonia", "aureliano-pig-tail"],
    quote: "Races condemned to one hundred years of solitude did not have a second opportunity on earth.",
    era: "~1970",
    mood: "apocalyptic"
  }
];

export function getChapterByNumber(num: number): ChapterData | undefined {
  return chaptersData.find(c => c.number === num);
}

export function getChaptersUpTo(num: number): ChapterData[] {
  return chaptersData.filter(c => c.number <= num);
}
