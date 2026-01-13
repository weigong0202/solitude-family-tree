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
    summary: "José Arcadio Buendía founds Macondo, a village of twenty adobe houses built on the bank of a river of clear water that ran along a bed of polished stones. Enchanted by the gypsies' inventions—magnets, telescopes, magnifying glasses—he becomes obsessed with science and alchemy, dreaming of using magnets to extract gold from the earth. The gypsy Melquíades, ancient and weathered, brings knowledge and wonder from distant lands, gifting José Arcadio with manuscripts written in an indecipherable script. Meanwhile, Úrsula holds the family together with practical wisdom and fierce determination, establishing the routines and traditions that will define the Buendía household for generations to come.",
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
    summary: "The history of the Buendía and Iguarán families is revealed—cousins who married despite warnings of producing children with pig's tails, a curse that will haunt the family through generations. José Arcadio Buendía kills Prudencio Aguilar in a duel over an insult to his manhood, and the ghost of the dead man begins appearing in the house, lonely and sad, searching for water to clean his wound. Haunted by guilt and the specter's presence, José Arcadio leads his family on an arduous journey across the mountains to found Macondo, seeking a place where the past cannot find them. Young José Arcadio, growing into a man of enormous appetites, discovers desire with the enigmatic Pilar Ternera, whose cards foretell destinies she cannot change.",
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
    summary: "The orphan Rebeca arrives carrying a canvas sack containing her parents' bones, which clatter with every step she takes. She brings with her the insomnia plague that spreads through Macondo like wildfire, a sickness that erases memory until the townspeople forget the names of everyday objects and must label everything—'This is a cow, she must be milked every morning.' Melquíades, having conquered death itself in the cemeteries of Singapore, returns to cure them with a miraculous potion. Amaranta is born into this world of forgetting, and as the girls grow, a fierce rivalry develops between her and Rebeca over the elegant Italian Pietro Crespi, whose pianola music enchants them both.",
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
    summary: "Colonel Aureliano, silent and solitary since birth, falls in love with the child Remedios Moscote, waiting years until she is old enough to marry. Their wedding is a brief moment of tenderness in a world growing dark with political tension as Conservatives and Liberals begin their endless struggle for power. The seeds of civil war are planted in Macondo's soil, and Aureliano feels something awakening in his blood—a calling to arms he cannot yet name. José Arcadio returns from his wanderings utterly transformed: enormous, tattooed from head to toe with mysterious symbols, speaking of the sixty-five countries he has crossed and the women he has known in every port.",
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
    summary: "The civil war consumes Aureliano completely, transforming the quiet silversmith into the legendary Colonel who will organize thirty-two armed uprisings and lose them all. Remedios dies young, bleeding to death with twins in her womb, and with her goes Aureliano's capacity for love—his heart hardens into something cold and mechanical. José Arcadio scandalizes the family by marrying Rebeca, and they are banished to a house at the edge of the cemetery where he is later found dead, a trickle of blood flowing from his ear through the streets of Macondo. Across the war-torn country, in different towns and different beds, Aureliano's seventeen illegitimate sons are born to seventeen different women, each marked by the solitude of their father.",
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
    summary: "José Arcadio Buendía descends into a final, irrevocable madness, his brilliant mind unraveling until he speaks only in Latin, a language no one in Macondo understands. The family ties him to the great chestnut tree in the courtyard, where he will remain for years, weathering sun and rain, visited only by the ghost of Prudencio Aguilar who has finally found him. Melquíades dies again in his mysterious room, this time for good, leaving behind parchments covered in verses written in Sanskrit that will take generations to decipher. The war drags on without meaning or end, and the Buendía house becomes a way station for soldiers of both sides, all of them equally lost.",
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
    summary: "Left in charge of Macondo while the Colonel fights his wars, the bastard Arcadio transforms into a cruel tyrant drunk on power, issuing absurd decrees and executing his enemies without trial. He takes the silent, invisible Santa Sofía de la Piedad as his woman, and she bears him three children in quiet acceptance. His reign of terror ends when Conservative forces retake the town, and facing the firing squad, Arcadio finally learns the truth of his parentage—that Pilar Ternera, not Úrsula, is his mother. He dies without fear, shouting defiance at his executioners, leaving behind twins and a daughter of impossible beauty.",
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
    summary: "The identical twins José Arcadio Segundo and Aureliano Segundo grow up so alike that even their mother cannot tell them apart, and the family suspects they were switched during a childhood game and never switched back. Aureliano Segundo, bursting with appetite for life, discovers that his passionate love for the concubine Petra Cotes causes their animals to multiply miraculously—rabbits breed by the hundreds, cattle fill the fields. Meanwhile, Remedios the Beauty grows into the most beautiful woman ever seen, so beautiful that men die just from glimpsing her, her presence filling rooms with a devastating perfume that lingers for hours after she has gone.",
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
    summary: "Colonel Aureliano's seventeen illegitimate sons arrive in Macondo during carnival, all bearing their father's unmistakable features and all marked with ash crosses on their foreheads by the priests who baptized them. These sons, scattered across the country like seeds of war, will be hunted down and killed one by one—shot in the street, poisoned, stabbed—until none remain. Aureliano José, consumed by forbidden desire for his aunt Amaranta, pursues her relentlessly despite her rejections, and dies in the street shot by a captain who mistakes him for a rebel. The Colonel retreats further into himself, making his little gold fish in endless, meaningless repetition.",
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
    summary: "Aureliano Segundo glimpses Fernanda del Carpio at carnival, where she reigns as beauty queen, and pursues her across the country to her crumbling highland mansion. She was raised in absolute isolation to be a queen, taught to embroider gold thread and eat at a table set for twelve though there was nothing to eat. Their marriage brings her rigid Catholic morality crashing against the exuberant Buendía spirit—she locks doors, imposes schedules, speaks in a formal Spanish no one understands, and wages constant war against the household's chaos. Yet she cannot compete with Petra Cotes for her husband's heart, and Aureliano Segundo divides his time between wife and mistress, prosperity and passion.",
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
    summary: "The American banana company arrives like a plague of prosperity, transforming sleepy Macondo into a frenzied boom town overnight. Modernity invades with brutal force—electricity turns night into day, cinema screens flicker with impossible images, and trains bring waves of strangers speaking languages no one understands. The gringos build their own fenced compound with swimming pools and tennis courts, living in an air-conditioned paradise while workers sweat in the plantations. José Arcadio Segundo, radicalized by injustice, becomes a union organizer, standing in the sweltering streets to rally workers against the company's abuses, unaware that he is marching toward catastrophe.",
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
    summary: "Remedios the Beauty, untouched by earthly desires and innocent of her own devastating effect on men, ascends bodily into heaven one afternoon while folding sheets in the garden—rising up with the linens flapping around her until she disappears into the sky. Her unearthly beauty has caused the deaths of multiple men: one who climbed to her bathroom roof to glimpse her bathing fell to his death, another was trampled by horses in his distraction. Meanwhile, Meme falls secretly and desperately in love with Mauricio Babilonia, a young mechanic from the banana company who is perpetually surrounded by yellow butterflies that announce his presence wherever he goes.",
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
    summary: "Colonel Aureliano Buendía, having lost all thirty-two wars and all capacity for human feeling, spends his final years in the workshop making little gold fish with ruby eyes, then melting them down to make them again in an endless cycle of creation and destruction. He has become unreachable, speaking to no one, eating alone, his legend already fading from the country's memory as new generations forget his wars. One morning he walks out to the chestnut tree where his father spent his final mad years, and there he dies standing, his eyes open, while the family does not discover his body until the vultures begin to circle overhead.",
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
    summary: "Meme falls deeply and recklessly in love with Mauricio Babilonia, meeting him secretly in the darkness of the bathroom while yellow butterflies swirl around them both. Fernanda, discovering the affair through the telltale butterflies that invade the house, arranges for a guard to shoot Mauricio as a chicken thief, leaving him paralyzed for life in a cot where he will lie for decades. Meme is sent to a distant convent without explanation, and from that moment she never speaks another word—not when she gives birth to her illegitimate son, not for the rest of her silent life. The child, Aureliano, is sent back to Macondo in a basket, another secret for Fernanda to hide.",
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
    summary: "The banana workers strike, and three thousand men, women, and children gather at the train station to await the government's response. The army surrounds them, and when the order comes, soldiers open fire with machine guns until the plaza is carpeted with bodies. José Arcadio Segundo survives only by falling among the dead and being loaded onto a train with two hundred carriages of corpses bound for the sea. When he returns to tell what happened, no one believes him—the government has declared that nothing occurred, and gradually the people of Macondo accept this official forgetting. Then the rain begins to fall, and it will not stop for nearly five years.",
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
    summary: "The rain falls without pause for four years, eleven months, and two days. Macondo rots from within—roofs collapse, walls crumble, mold devours everything, and the jungle begins its slow reconquest of the town. The banana company abandons its plantations and fenced compounds, leaving behind rusting machinery and empty buildings that the rain dissolves. Aureliano Babilonia arrives as a baby in a basket, Meme's secret son delivered by nuns who reveal nothing of his origins. Fernanda, alone now with her secrets and her rigid propriety, tries desperately to maintain appearances in a house where mushrooms grow on the walls and the furniture sinks into mud.",
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
    summary: "Úrsula, having lived well past one hundred years and witnessed the entire saga of her family's rise and fall, shrinks steadily until she is no larger than a newborn, her ancient body curling into itself like a fern. The children play with her as if she were a doll, carrying her from room to room, until one morning she simply stops breathing. With her death, the soul of the house dies—she was its foundation, its memory, its fierce protective spirit. Fernanda rules over the ruins with iron will and increasing delusion, writing letters to her children about servants and luxuries that do not exist. Aureliano Babilonia grows up in near-total isolation, raised by no one, teaching himself from Melquíades' encyclopedias.",
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
    summary: "Amaranta Úrsula returns from Europe bursting with life and modern spirit, her Belgian husband Gastón trailing bewildered behind her. She is determined to restore the house and Macondo to their former glory, attacking the decay with Dutch cleansers and organizational fury, filling rooms with canaries whose song cannot mask the silence of ruin. But she cannot reverse what time has done—the house is too far gone, the town nearly abandoned, and the old magic that once animated Macondo has left the world forever. Rebeca dies alone and forgotten in her house at the edge of the cemetery, her body not discovered for days, having outlived everyone who remembered why she was banished.",
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
    summary: "Aureliano Babilonia and Amaranta Úrsula, not knowing they are aunt and nephew, fall into a consuming, delirious love that neither can resist. Gastón, finally understanding he has lost his wife, departs for Belgium and never returns. The lovers live in wild happiness as the house crumbles around them, making love in every room, indifferent to the red ants that devour the foundations and the jungle that pushes through the walls. José Arcadio returns from Rome where he was never a pope but merely a corrupt hedonist, and is drowned in his own bath by four children he had lured with promises of candy. The curse draws closer with every passionate embrace.",
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
    summary: "Amaranta Úrsula gives birth to the last Buendía—a child born with the pig's tail that Úrsula had feared for generations, the curse finally fulfilled. She bleeds to death despite Aureliano's desperate attempts to save her, and he wanders the empty streets of Macondo in grief until he realizes he is utterly alone. Returning to the house, he finds his newborn son being devoured by red ants and finally, in his devastation, deciphers Melquíades' manuscripts—discovering they contain the entire history of the family, written a century before it happened. As he reads the final line, a biblical wind rises and erases Macondo from the earth forever, for races condemned to one hundred years of solitude do not have a second opportunity on earth.",
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
