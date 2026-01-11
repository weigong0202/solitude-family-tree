import type { Character, ChapterInfo } from '../types';

export const characters: Character[] = [
  // Generation 1 - Founders
  {
    id: 'jose-arcadio-buendia',
    name: 'José Arcadio Buendía',
    nickname: 'The Founder',
    generation: 1,
    birthChapter: 1,
    deathChapter: 6,
    parentIds: [],
    spouseIds: ['ursula'],
    description: 'Founder of Macondo, an idealistic dreamer obsessed with science and alchemy.',
    physicalDescription: 'A giant of a man with wild hair and an unkempt beard, powerful build',
    biography: `José Arcadio Buendía was a man consumed by the impossible. After killing Prudencio Aguilar in a dispute over cockfighting, he led his wife Úrsula and a band of young adventurers through the wilderness, haunted by the ghost of the man he slew, until they founded Macondo beside a river of prehistoric stones.

In this isolated paradise, he became obsessed with every marvel the gypsies brought: magnets that he believed could extract gold from the earth, astronomical instruments, alchemical laboratories, and the daguerreotype. He spent his fortune on these pursuits, neglecting his family, convinced that science held the key to transcending human limitations.

His greatest obsession became the pursuit of knowledge itself. He discovered that the earth was round like an orange, a revelation that drove him toward the edge of reason. When he attempted to prove that Tuesday had returned repeatedly, his family found him speaking in Latin, a language he had never learned. They tied him to the chestnut tree in the courtyard, where he would remain for the rest of his days, speaking only in the dead tongue, visited by the ghost of Melquíades, until rain and solitude finally claimed him.`,
  },
  {
    id: 'ursula',
    name: 'Úrsula Iguarán',
    nickname: 'The Matriarch',
    generation: 1,
    birthChapter: 1,
    deathChapter: 17,
    parentIds: [],
    spouseIds: ['jose-arcadio-buendia'],
    description: 'The matriarch who holds the family together through a century of solitude.',
    physicalDescription: 'Small but tireless woman with sharp eyes and a practical demeanor',
    biography: `Úrsula Iguarán was the indestructible spine of the Buendía family, a woman who lived so long that she witnessed the birth and death of four generations, outlasting wars, plagues, and the slow decay of everything she built with her own calloused hands.

She married her cousin José Arcadio Buendía despite the family legend that such unions produced children with pig's tails. On her wedding night, she wore a chastity belt her mother had given her, a garment she would not remove for months until Prudencio Aguilar's mockery drove her husband to murder. This original sin—violence born of wounded pride—haunted the family across a hundred years.

When her husband lost his mind to impossible dreams, Úrsula held the house together. She started a candy animals business that made the family prosperous. She rebuilt the house again and again, expanding it to accommodate new generations, new wives, new disasters. She raised children, grandchildren, and great-grandchildren, burying most of them, her grief as endless as her energy. In her final years, blind but unwilling to admit it, she navigated the house by memory, still commanding, still working, until she shrank to the size of a fetus and died during Holy Week, smaller than she had been at birth.`,
  },
  {
    id: 'melquiades',
    name: 'Melquíades',
    nickname: 'The Gypsy',
    generation: 1,
    birthChapter: 1,
    deathChapter: 6,
    parentIds: [],
    spouseIds: [],
    description: 'The wise gypsy who brings knowledge to Macondo. Returns from death to write prophecies.',
    physicalDescription: 'Gloomy man with an Asiatic look, large black hat like a raven, velvet vest',
    biography: `Melquíades was a gypsy sage who arrived in Macondo with the annual caravan, bearing magnets, telescopes, and the accumulated wisdom of the world's forgotten libraries. He befriended José Arcadio Buendía, recognizing in him a kindred spirit consumed by impossible knowledge.

He died of fever in Singapore, but death could not hold him. He found the afterlife so lonely, missing the company of the living, that he returned to Macondo, taking up residence in a small room where he wrote manuscripts in Sanskrit, prophesying the entire history of the Buendía family. These parchments, incomprehensible to all who attempted to read them, contained the family's destiny encoded in verses.

Even after his second death—drowned in the river—his ghost continued to appear, particularly to the Aurelianos who shared his scholarly nature. He existed outside of time, appearing to different generations as the same ageless figure, guiding them toward his manuscripts, waiting for the one who would finally decipher the prophecy and understand that the last line of the family had been condemned to a hundred years of solitude with no second opportunity on earth.`,
    isGhost: true,
    quote: 'Things have a life of their own. It is simply a matter of waking up their souls.',
  },

  // Generation 2
  {
    id: 'jose-arcadio-son',
    name: 'José Arcadio',
    nickname: 'The Giant',
    generation: 2,
    birthChapter: 2,
    deathChapter: 5,
    parentIds: ['jose-arcadio-buendia', 'ursula'],
    spouseIds: ['rebeca'],
    description: 'The first son, known for his enormous size and primal nature.',
    physicalDescription: 'Monstrously large with tremendous strength, tattooed body',
    biography: `José Arcadio was born with the enormous physical presence that would define his life—a body so large it seemed to belong to a different species entirely. As a youth, he lost his virginity to Pilar Ternera in her cramped room, an encounter that would produce his illegitimate son Arcadio, though he would never know it.

When the gypsies returned, he fell in love with a girl from the carnival and vanished with them, leaving his family to mourn him as dead. He traveled the world sixty-five times, his body becoming a map of tattoos, each one a story of exotic ports and stranger women. He spoke in a voice that shook the foundations of houses.

He returned years later, even more enormous, covered in illustrations, smelling of gunpowder and the sea. He married Rebeca, his adopted sister, in defiance of everyone's objections—a scandal that got them banished from the Buendía house. They lived in exile across town, consumed by a passion so intense it frightened the neighbors. His death came mysteriously: a gunshot wound that appeared in his chest while he was locked alone in his room. The thread of blood that flowed from his ear traveled through the entire town, around corners and under doors, to find Úrsula in her kitchen—a final message from son to mother that needed no words.`,
  },
  {
    id: 'colonel-aureliano',
    name: 'Colonel Aureliano Buendía',
    nickname: 'The Colonel',
    generation: 2,
    birthChapter: 2,
    deathChapter: 13,
    parentIds: ['jose-arcadio-buendia', 'ursula'],
    spouseIds: ['remedios-moscote'],
    description: 'Led 32 armed uprisings and lost them all. A solitary man who makes gold fish.',
    physicalDescription: 'Thin and bony with sad eyes, later with a permanent melancholy',
    biography: `Colonel Aureliano Buendía organized thirty-two armed uprisings and lost them all. He had seventeen sons by seventeen different women, all killed in a single night before the eldest reached thirty-five. He survived fourteen assassination attempts, seventy-three ambushes, and a firing squad. He lived to see the signing of the Treaty of Neerlandia, which put an end to the war, and lived to be old and alone.

Born silent and with his eyes open, he wept in his mother's womb and could only be born after being turned in her belly. As a child, he predicted that a pot of soup would fall moments before it happened. He married Remedios Moscote when she was still a child, losing her to a pregnancy that consumed her while she was barely more than a girl herself.

The wars made him legendary but hollow. He ordered executions without feeling, including that of his own friend. He survived shooting himself through the chest only because the doctor who loved his mother marked the one place where a bullet would miss his heart. In his final years, he retreated to his workshop, making tiny gold fish that he melted down and remade in an endless cycle—crafting and destroying, a metaphor for everything he had become. He died urinating against the chestnut tree where his father had been tied, understanding at last the solitude that was his inheritance.`,
  },
  {
    id: 'amaranta',
    name: 'Amaranta Buendía',
    generation: 2,
    birthChapter: 3,
    deathChapter: 15,
    parentIds: ['jose-arcadio-buendia', 'ursula'],
    spouseIds: [],
    description: 'Bitter and resentful, she weaves her own shroud and rejects all suitors.',
    physicalDescription: 'Beautiful in youth, wears a black bandage on her burned hand',
    biography: `Amaranta Buendía was consumed by a love that turned to poison. She fell for Pietro Crespi, the Italian music teacher, but so did her adopted sister Rebeca. When Rebeca won him, Amaranta swore she would prevent the marriage even if she had to kill herself.

She succeeded in destroying Rebeca's engagement by revealing Pietro's letters to the family, but her victory was hollow. When Pietro then courted Amaranta herself, she rejected him with cold cruelty—not because she didn't love him, but because she had become incapable of accepting love. He killed himself at her door, slashing his wrists after serenading her one last time.

The guilt transformed her. She burned her hand on the stove and wore a black bandage over it for the rest of her life, a visible reminder of her sin. She became the bitter spinster of the house, secretly lusting after her nephew Aureliano José—a forbidden desire that horrified them both. When Colonel Gerineldo Márquez courted her for years, she made him wait until she was old and he was older, then rejected him too. Her final years were spent weaving her own burial shroud, knowing that death would come when she finished it. She completed it perfectly, lay down, and died, taking letters to the dead from everyone in Macondo to the other side.`,
  },
  {
    id: 'rebeca',
    name: 'Rebeca Buendía',
    nickname: 'The Outsider',
    generation: 2,
    birthChapter: 3,
    deathChapter: 18,
    parentIds: [],
    spouseIds: ['jose-arcadio-son'],
    description: 'Adopted daughter who arrived with her parents\' bones. Eats earth when anxious.',
    physicalDescription: 'Green eyes, long dark hair, delicate features',
    biography: `Rebeca arrived in Macondo as a child, carried by merchants who had promised her dying parents to deliver her to distant relatives. She came with a canvas sack containing her parents' bones, which clicked together as she moved, and a strange compulsion: when distressed, she ate earth from the courtyard and whitewash scraped from the walls.

She brought the insomnia plague with her, a sickness that spread through the town and erased everyone's memory, forcing them to label every object with its name and purpose. But she also brought beauty—green eyes that captivated Pietro Crespi and a passionate nature that burned beneath her quiet exterior.

When José Arcadio returned from his wanderings, their forbidden attraction exploded into an all-consuming passion. They married in defiance of the family and were exiled, living in a house across town where they made love with an intensity that scandalized the neighborhood. After José Arcadio's mysterious death, Rebeca sealed herself in that house for the rest of her life. She became a ghost, glimpsed occasionally through shuttered windows, eating earth again, waiting for a death that took decades to arrive. The family forgot her while she still lived, and when she finally died, it was Aureliano Segundo who had to break down her door to find her, a lizard-like creature who no longer resembled the passionate woman she had once been.`,
  },

  // Generation 3
  {
    id: 'arcadio',
    name: 'Arcadio',
    generation: 3,
    birthChapter: 4,
    deathChapter: 7,
    parentIds: ['jose-arcadio-son', 'pilar-ternera'],
    spouseIds: ['santa-sofia'],
    description: 'Illegitimate son who becomes a cruel dictator of Macondo during the civil war.',
    physicalDescription: 'Resembles his father in stature, stern expression',
    biography: `Arcadio never knew his true parents. He was the illegitimate son of José Arcadio and Pilar Ternera, but Úrsula raised him as her own grandchild, and the truth of his parentage was carefully hidden from him. This fundamental displacement—belonging nowhere, loved by all yet claimed by none—shaped his hungry soul.

When Colonel Aureliano left to fight in the civil wars, he appointed Arcadio as civil and military leader of Macondo. The power corrupted him absolutely. He became a petty tyrant, executing enemies real and imagined, imposing ridiculous taxes and cruel punishments. He issued decrees of death with the casualness of a man ordering lunch.

His reign ended when conservative forces retook the town. He was sentenced to death by firing squad. Facing the rifles, Arcadio thought not of his cruelties but of his daughter—his wife Santa Sofía de la Piedad was pregnant when he died, and he would never see the twins she would bear. His last act was to refuse the blindfold, to spit at his executioners, and to understand too late that power had been his undoing. The bullets found him before he could become the father he might have been.`,
  },
  {
    id: 'aureliano-jose',
    name: 'Aureliano José',
    generation: 3,
    birthChapter: 5,
    deathChapter: 9,
    parentIds: ['colonel-aureliano', 'pilar-ternera'],
    spouseIds: [],
    description: 'Son of the Colonel, dies young in the war. Had forbidden love for his aunt.',
    physicalDescription: 'Young soldier with his father\'s features',
    biography: `Aureliano José was the son of Colonel Aureliano Buendía and Pilar Ternera, though like his cousin Arcadio, he was raised in the Buendía house without full knowledge of his origins. He grew up in the shadow of his legendary father, a man who was more myth than parent.

His great tragedy was falling in love with his aunt Amaranta. She was older, bitter, beautiful in her severity—and she returned his passion with equal intensity, though she could never admit it. Their encounters were feverish and guilt-ridden, always stopping just short of consummation. When he left to join the war, he thought only of returning to her.

The war consumed him. He fought alongside his father, learning the trade of revolution, but his heart remained in Macondo with Amaranta. He deserted to return to her, to finally consummate their forbidden love. But Amaranta, terrified of her own desires, rejected him utterly. In his despair, he wandered the streets until a soldier shot him dead—the boy who had run away from war only to find death waiting for him at home. Amaranta would wear black for the rest of her life, though she told no one why.`,
  },
  {
    id: 'remedios-moscote',
    name: 'Remedios Moscote',
    generation: 3,
    birthChapter: 4,
    deathChapter: 5,
    parentIds: [],
    spouseIds: ['colonel-aureliano'],
    description: 'Child bride of Colonel Aureliano. Dies young.',
    physicalDescription: 'Very young, innocent features, childlike beauty',
    biography: `Remedios Moscote was barely more than a child when Colonel Aureliano Buendía first saw her in her father's house and decided she would be his wife. She still played with dolls, still wet the bed, still spoke with the vocabulary of innocence. Her parents agreed to the match on the condition that they wait until she came of age.

Their marriage was tender and strange. Aureliano, already a man of melancholy depths, found in her a purity that silenced his darker impulses. She brought lightness into the Buendía house, her childish laughter echoing through corridors accustomed to brooding. She became pregnant almost immediately, her small body struggling to contain the life growing within it.

The pregnancy proved too much. Remedios died in a pool of blood, poisoned by the twin fetuses she carried, victims of a pregnancy her young body could not survive. She was gone before she had ever truly been a woman, leaving Aureliano with only the memory of her innocence and a grief that would calcify into the legendary coldness of his later years. He would marry no one else, though he would father seventeen sons by seventeen different women—none of whom he would ever love.`,
  },
  {
    id: 'pilar-ternera',
    name: 'Pilar Ternera',
    nickname: 'The Fortune Teller',
    generation: 2,
    birthChapter: 2,
    deathChapter: 20,
    parentIds: [],
    spouseIds: [],
    description: 'The oldest person in Macondo, a fortune teller who had children with two Buendía brothers.',
    physicalDescription: 'Voluptuous, laughing woman who ages into an ancient crone',
    biography: `Pilar Ternera laughed her way through a hundred and forty-five years, the longest life in Macondo's history. In her youth, she was voluptuous and generous, sharing her body with both José Arcadio and Aureliano Buendía, bearing a son by each—Arcadio and Aureliano José—though she gave both children to the family to raise.

She read fortunes in cards, glimpsing the fates of everyone who sought her wisdom, though she could never change what she foresaw. Her laugh was famous throughout the town, a deep, knowing sound that seemed to mock the very concept of tragedy. When she could no longer earn her living with her body, she opened a brothel that became the town's most popular establishment.

In her final years, she became so ancient that she seemed to exist outside of time entirely. Her skin became transparent, her body light as paper. She spent her last decades in a wicker rocking chair, surrounded by the ghosts of everyone she had ever loved, conversing with the dead as easily as with the living. When Aureliano Babilonia came to her seeking information about his origins, she was already more memory than flesh—but she remembered everything. She died only when Macondo itself was dying, having outlasted almost everything she had ever known.`,
  },
  {
    id: 'santa-sofia',
    name: 'Santa Sofía de la Piedad',
    generation: 3,
    birthChapter: 6,
    deathChapter: 19,
    parentIds: [],
    spouseIds: ['arcadio'],
    description: 'Silent, hardworking wife of Arcadio. A ghost-like presence in the house.',
    physicalDescription: 'Thin, silent woman with a haunted look',
    biography: `Santa Sofía de la Piedad was so silent, so self-effacing, that the family sometimes forgot she existed. Pilar Ternera arranged her marriage to Arcadio, her own son, sending the virgin girl to his bed without explanation. Santa Sofía accepted this as she accepted everything—without complaint, without question, without visible emotion.

She bore Arcadio three children before the firing squad took him: Remedios the Beauty and the twins Aureliano Segundo and José Arcadio Segundo. After his death, she remained in the Buendía house, becoming its silent caretaker. For decades she cooked, cleaned, and maintained the endless fight against dust and decay, asking for nothing, receiving less.

She watched generations rise and fall, tending to them all with the same quiet dedication. When Úrsula finally died, Santa Sofía found herself the last adult in a house of children and lunatics. One day, without announcement or farewell, she simply walked out the door with a small bundle of clothes and vanished forever. No one knew where she went or when she died. She had spent her entire life being invisible; in the end, she simply completed the transformation.`,
  },

  // Generation 4
  {
    id: 'remedios-la-bella',
    name: 'Remedios the Beauty',
    nickname: 'The Beautiful',
    generation: 4,
    birthChapter: 8,
    deathChapter: 12,
    parentIds: ['arcadio', 'santa-sofia'],
    spouseIds: [],
    description: 'The most beautiful woman ever seen. Her beauty causes deaths. Ascends to heaven.',
    physicalDescription: 'Unearthly beauty, simple white dress, innocent expression',
    biography: `Remedios the Beauty possessed a face so perfect that men died simply from looking at her. Her beauty was not of this world—it was absolute, terrifying, and completely wasted on her, for she had the mind of a child and no understanding of the devastation she caused.

She wandered the house in simple dresses, sometimes naked, indifferent to the chaos her body created. A stranger climbed onto the roof to watch her bathe and fell to his death. A commander who glimpsed her sleeping never recovered his sanity. She shaved her head to avoid the inconvenience of hair. She wore only a rough cassock because corsets and petticoats annoyed her.

The family believed she was mentally deficient, but Úrsula eventually understood that Remedios had simply evolved beyond human concerns. She was pure, untouchable, existing on a plane where desire and death could not reach her. One afternoon, while folding laundry in the courtyard, she simply rose into the air. She ascended through the sky, waving goodbye to the family, carried upward by the sheets until she disappeared forever into the realm of the impossible. The sheets were never found; the beauty was never explained.`,
  },
  {
    id: 'aureliano-segundo',
    name: 'Aureliano Segundo',
    nickname: 'The Twin',
    generation: 4,
    birthChapter: 8,
    deathChapter: 15,
    parentIds: ['arcadio', 'santa-sofia'],
    spouseIds: ['fernanda'],
    description: 'The prosperous twin, known for his parties, raffles, and affair with Petra Cotes.',
    physicalDescription: 'Robust and jovial, later becomes corpulent',
    biography: `Aureliano Segundo was born a twin, identical to his brother José Arcadio Segundo in every way—so identical that even their mother confused them, and legend held that they had accidentally switched identities in childhood. But where his brother became grave and obsessive, Aureliano Segundo became the embodiment of appetite and excess.

He married Fernanda del Carpio for her beauty and aristocratic pretensions, but his heart belonged to Petra Cotes, his mistress. Their love was so potent that it made animals multiply miraculously—her livestock bred with supernatural abundance, making them both wealthy. He threw legendary parties, eating contests where he battled visiting champions, celebrations that lasted for days.

The banana company's arrival brought even greater prosperity, and he squandered it magnificently. But when the rains came—four years, eleven months, and two days of continuous downpour—his fortune dissolved. He spent his final years hosting lottery drawings, growing thin and desperate, trying to scrape together enough money to send his daughter Amaranta Úrsula to Belgium. He died the same day as his twin brother, their lives as linked in death as they had been at birth.`,
  },
  {
    id: 'jose-arcadio-segundo',
    name: 'José Arcadio Segundo',
    nickname: 'The Other Twin',
    generation: 4,
    birthChapter: 8,
    deathChapter: 15,
    parentIds: ['arcadio', 'santa-sofia'],
    spouseIds: [],
    description: 'The twin who witnesses the banana company massacre. Spends his life searching for truth.',
    physicalDescription: 'Identical to his twin but more serious demeanor',
    biography: `José Arcadio Segundo was the twin who remembered. Where his brother Aureliano Segundo pursued pleasure, he pursued understanding—first as a cockfight organizer, then as a labor leader for the banana company workers.

He organized the great strike against the banana company, standing before the crowd of three thousand workers and their families in the train station square. He witnessed what happened next: the soldiers opening fire, the bodies falling, the blood pooling on the cobblestones. He survived by pretending to be dead, then escaped on the train that carried the corpses to the sea.

But when he returned to Macondo, no one believed him. The official story claimed nothing had happened. There had been no massacre. There had never been three thousand people in that square. The denial was absolute, enforced by the military government, repeated until even the survivors doubted their memories. José Arcadio Segundo retreated to Melquíades's room, spending the rest of his life studying the gypsy's parchments and insisting to anyone who would listen: "There were more than three thousand of them." He died still remembering what everyone else had agreed to forget.`,
  },
  {
    id: 'fernanda',
    name: 'Fernanda del Carpio',
    nickname: 'The Queen',
    generation: 4,
    birthChapter: 10,
    deathChapter: 17,
    parentIds: [],
    spouseIds: ['aureliano-segundo'],
    description: 'The aristocratic wife who imposes rigid order on the house.',
    physicalDescription: 'Elegant, haughty, always dressed in mourning',
    biography: `Fernanda del Carpio was raised to be a queen. Her impoverished aristocratic family taught her that she was destined for royalty, and she spent her childhood practicing for a coronation that would never come—learning Latin prayers, perfect posture, and elaborate table manners while their ruined mansion crumbled around them.

She arrived in Macondo as the winner of a beauty contest, catching Aureliano Segundo's eye with her regal bearing and her complete inability to understand that she was not, in fact, royal. She married him and immediately set about transforming the chaotic Buendía house into a proper aristocratic household, imposing rigid meal schedules, formal dress codes, and endless religious observances.

She never understood her husband's world of parties and excess, and she despised Petra Cotes with a hatred that lasted decades. When her daughter Meme fell pregnant by a mechanic, Fernanda sent her to a convent and raised the child, Aureliano Babilonia, as a secret prisoner, telling the family he was found in a basket. She died writing endless letters to invisible doctors, still convinced of her own nobility, still trying to impose order on a family that had always lived in chaos.`,
  },
  {
    id: 'petra-cotes',
    name: 'Petra Cotes',
    generation: 4,
    birthChapter: 9,
    parentIds: [],
    spouseIds: [],
    description: 'Mistress of Aureliano Segundo. Her love makes animals multiply miraculously.',
    physicalDescription: 'Mulatto woman with a generous body and warm smile',
    biography: `Petra Cotes loved with a power that bent the laws of nature. When she and Aureliano Segundo came together, their passion made her animals breed with miraculous abundance—rabbits multiplied beyond counting, horses foaled with impossible frequency, and her yard became a sea of reproductive chaos that made them both wealthy.

She was everything Fernanda was not: warm where Fernanda was cold, generous where Fernanda was rigid, earthy where Fernanda was ethereal. She understood Aureliano Segundo's appetites and matched them with her own. Their love was the longest affair in Macondo's history, outlasting his marriage, outlasting his fortune, outlasting his life.

When the rains ruined everything and Aureliano Segundo lay dying, it was Petra Cotes who held lottery drawings to pay for his medicines. After his death, she continued to care for his legitimate family, sending food baskets to Fernanda's house, supporting the children of the woman who had always despised her. She survived almost everyone, growing old in a house filled with memories and miraculous chickens, still laughing, still loving, still living proof that some passions could outlast even death.`,
  },

  // Generation 5
  {
    id: 'renata-remedios',
    name: 'Renata Remedios',
    nickname: 'Meme',
    generation: 5,
    birthChapter: 12,
    deathChapter: 16,
    parentIds: ['aureliano-segundo', 'fernanda'],
    spouseIds: [],
    description: 'Daughter sent to a convent after her forbidden love affair.',
    physicalDescription: 'Lively young woman with modern tastes',
    biography: `Meme was the joyful one, the daughter who inherited her father's appetite for life rather than her mother's rigid propriety. She learned to play the clavichord with genuine passion, threw herself into the town's social life, and brought a lightness to the Buendía house that it had not seen in generations.

Then she met Mauricio Babilonia, a mechanic from the banana company workshops. He was everything her mother despised—common, working-class, but surrounded always by a cloud of yellow butterflies that announced his presence like a supernatural calling card. Their love was fierce and secret, conducted in stolen moments in the bathroom while the yellow butterflies fluttered outside, giving them away to anyone who knew how to read the signs.

Fernanda caught them. She had Mauricio shot as a chicken thief, leaving him paralyzed in a bed for the rest of his life. She sent Meme to a convent in the mountains, where Meme gave birth to Aureliano Babilonia and then never spoke another word for the rest of her life. She had chosen silence as her only rebellion, refusing to participate in a world that had destroyed her love. She died in the convent, still mute, having never seen her son grow up to decipher the prophecy that had condemned them all.`,
  },
  {
    id: 'jose-arcadio-iii',
    name: 'José Arcadio',
    nickname: 'The Seminarian',
    generation: 5,
    birthChapter: 13,
    deathChapter: 19,
    parentIds: ['aureliano-segundo', 'fernanda'],
    spouseIds: [],
    description: 'Raised to be pope but returns from Rome corrupted.',
    physicalDescription: 'Effeminate, pampered appearance',
    biography: `José Arcadio was raised from infancy to become pope. Fernanda, convinced that her lineage deserved nothing less than the throne of St. Peter, sent him to Rome at age twelve to begin his ascent through the Church hierarchy. She waited decades for word of his ordination, his promotion, his inevitable election.

What returned was something else entirely. The man who came back to Macondo after his mother's death was not a priest but a hedonist—soft, pampered, more interested in luxury baths and antiques than in any spiritual calling. He claimed his inheritance and immediately set about living a life of languid decadence, swimming in the pool he built in the courtyard, buying beautiful objects, speaking in a Latin that seemed more theatrical than holy.

He tyrannized the children who came to worship him, demanding perfection and dispensing punishment. His death was strange and fitting: drowned in his own pool by four of the children he had mistreated, who then stole his gold. He died as he had lived—in water, surrounded by beautiful things, alone with his corruption. The gold they took had already been hidden for decades; they found only the empty hiding places and fled, leaving his body to float until Aureliano Babilonia found him.`,
  },
  {
    id: 'amaranta-ursula',
    name: 'Amaranta Úrsula',
    generation: 5,
    birthChapter: 14,
    deathChapter: 20,
    parentIds: ['aureliano-segundo', 'fernanda'],
    spouseIds: ['gaston'],
    description: 'The last hope of the family. Vibrant and modern.',
    physicalDescription: 'Beautiful, spirited, with a modern European style',
    biography: `Amaranta Úrsula was the final burst of life in the dying Buendía line. Raised by a silent grandmother she did not recognize as such, educated in Brussels, she returned to Macondo with a Belgian husband, modern ideas, and an infectious energy that briefly revived the crumbling house.

She painted the walls bright colors, opened the windows that had been shuttered for decades, and refused to accept the decay that had claimed everything around her. She planted flowers in the courtyard, started businesses, filled the house with music and laughter. She seemed to believe that sheer willpower could overcome a century of solitude.

But the family curse found her too. She fell in love with Aureliano Babilonia, not knowing he was her nephew—the son of her sister Meme, the boy raised in secret by Fernanda. Their love was passionate and genuine, and when she finally left her husband to be with him, it seemed like a triumph. But their child was born with a pig's tail, the sign that Úrsula had feared since the founding of the family. Amaranta Úrsula died in childbirth, hemorrhaging until there was nothing left, taking with her the last possibility that the Buendías might escape their fate.`,
  },

  // Generation 6
  {
    id: 'aureliano-babilonia',
    name: 'Aureliano Babilonia',
    nickname: 'The Last Aureliano',
    generation: 6,
    birthChapter: 16,
    deathChapter: 20,
    parentIds: ['renata-remedios', 'mauricio-babilonia'],
    spouseIds: [],
    description: 'The scholar who deciphers Melquíades\' manuscripts. Has incestuous love with his aunt.',
    physicalDescription: 'Scholarly, introspective young man',
    biography: `Aureliano Babilonia was raised in secret, hidden by Fernanda from the rest of the family, told he had been found floating in a basket. He grew up believing he had no history, no parents, no claim to the Buendía name—though he carried it unknowingly in his blood.

He discovered Melquíades's room and the mysterious parchments that had puzzled generations of Buendías. Where others had failed, he succeeded, slowly deciphering the Sanskrit script, learning the dead languages necessary to unlock the gypsy's prophecy. José Arcadio Segundo, the only one who acknowledged him, passed on the obsession before dying.

When Amaranta Úrsula returned from Europe, he fell in love with her, not knowing she was his aunt. Their passion was overwhelming and genuine, the kind of love that should have saved them but instead fulfilled the curse. When their son was born with a pig's tail, when Amaranta Úrsula bled to death, Aureliano finally deciphered the last of the manuscripts. He read his own story, the entire history of his family written in advance by Melquíades—and understood that he was reading the final page at the moment of his own death. A hurricane rose to destroy Macondo as he read the last line, and the city of mirrors was obliterated from the memory of men.`,
  },
  {
    id: 'mauricio-babilonia',
    name: 'Mauricio Babilonia',
    generation: 5,
    birthChapter: 14,
    deathChapter: 16,
    parentIds: [],
    spouseIds: [],
    description: 'Mechanic surrounded by yellow butterflies. Shot and paralyzed.',
    physicalDescription: 'Young mechanic always surrounded by yellow butterflies',
    biography: `Mauricio Babilonia was a mechanic at the banana company, an ordinary young man made extraordinary by one impossible detail: yellow butterflies followed him everywhere. They appeared whenever he was near, fluttering around him like a living announcement of his presence, a supernatural calling card that could not be hidden.

He fell in love with Meme Buendía at the cinema, beginning a forbidden romance that defied the barriers of class. Where she was aristocracy—or at least, her mother believed so—he was working class, dark-skinned, beautiful in his roughness. The butterflies gave them away every time they met in secret, hovering outside windows, clustering near bathrooms, making their love impossible to conceal.

Fernanda del Carpio had him shot as a chicken thief, though everyone knew there were no chickens involved. The bullet shattered his spine, leaving him paralyzed in a bed in his mother's house. He lay there for decades, unable to move, the yellow butterflies still appearing at his window, faithful to the end. He died without ever knowing that Meme had borne his son, a boy named Aureliano who would grow up to fulfill the prophecy that condemned them all.`,
  },
  {
    id: 'gaston',
    name: 'Gastón',
    generation: 5,
    birthChapter: 18,
    parentIds: [],
    spouseIds: ['amaranta-ursula'],
    description: 'Belgian husband of Amaranta Úrsula.',
    physicalDescription: 'European gentleman with refined manners',
    biography: `Gastón was a Belgian adventurer who married Amaranta Úrsula in Europe, believing he had found a woman as modern and restless as himself. He was patient and civilized, a man of the new century, tolerant of his wife's eccentric family stories and her determination to return to the backwater town where she had been born.

He followed her to Macondo with good humor, planning to start an airmail service, certain that civilization would eventually reach even this forgotten place. He waited for his airplane to arrive, conducting business by correspondence, watching his wife throw herself into the restoration of the crumbling Buendía house.

He was perhaps the only person in the story who escaped. When he realized that Amaranta Úrsula had fallen in love with Aureliano Babilonia, he did not rage or fight. He simply wrote letters, arranged his affairs, and left for Belgium. He sent word that his airplane had finally arrived and asked his wife to join him. She never came. He was already gone when the hurricane came to destroy everything, the only Buendía spouse to escape the family curse—by virtue of never having truly been part of the family at all.`,
  },

  // Generation 7
  {
    id: 'aureliano-pig-tail',
    name: 'Aureliano',
    nickname: 'The Last Buendía',
    generation: 7,
    birthChapter: 20,
    deathChapter: 20,
    parentIds: ['amaranta-ursula', 'aureliano-babilonia'],
    spouseIds: [],
    description: 'The last of the line, born with a pig\'s tail. Eaten by ants.',
    physicalDescription: 'Newborn with a pig\'s tail, the family curse fulfilled',
    biography: `The last Aureliano was born with the pig's tail that Úrsula Iguarán had feared since the founding of the family. For a hundred years, she had warned against the marriage of relatives, terrified of the monster that such unions would produce. When Amaranta Úrsula and Aureliano Babilonia conceived their child in ignorance of their blood relation, the curse that had waited a century finally came due.

He was beautiful despite the cartilaginous appendage at the base of his spine, and his parents loved him utterly. But his mother bled to death in childbirth, and his father, overwhelmed by grief and desperate to understand the meaning of their tragedy, abandoned the infant for just a few hours to finally decipher Melquíades's manuscripts.

In those hours, the ants came. A column of red ants, moving with terrible purpose, carried the last Buendía away piece by piece. By the time Aureliano Babilonia finished reading his own fate in the parchments, his son was gone, and the prophetic hurricane was rising to obliterate the city of mirrors and everything it had ever contained. The family ended as it had begun—in blood, in solitude, and in the impossible made real.`,
  },
];

export const chapters: ChapterInfo[] = [
  { number: 1, title: 'The Founding', yearRange: '~1820s' },
  { number: 2, title: 'The Gypsies', yearRange: '~1830s' },
  { number: 3, title: 'The Plague of Insomnia', yearRange: '~1840s' },
  { number: 4, title: 'The Civil Wars Begin', yearRange: '~1850s' },
  { number: 5, title: 'The War Continues', yearRange: '~1860s' },
  { number: 6, title: 'The Tree of Madness', yearRange: '~1870s' },
  { number: 7, title: 'Arcadio\'s Tyranny', yearRange: '~1880s' },
  { number: 8, title: 'The Twins', yearRange: '~1890s' },
  { number: 9, title: 'The Seventeen Aurelianos', yearRange: '~1900s' },
  { number: 10, title: 'Fernanda Arrives', yearRange: '~1910s' },
  { number: 11, title: 'The Banana Company', yearRange: '~1915' },
  { number: 12, title: 'Remedios Ascends', yearRange: '~1918' },
  { number: 13, title: 'The Colonel\'s Death', yearRange: '~1920' },
  { number: 14, title: 'Meme\'s Love', yearRange: '~1925' },
  { number: 15, title: 'The Massacre', yearRange: '~1928' },
  { number: 16, title: 'The Rain', yearRange: '~1932' },
  { number: 17, title: 'Úrsula\'s Death', yearRange: '~1940' },
  { number: 18, title: 'The Decay', yearRange: '~1950' },
  { number: 19, title: 'The Decline', yearRange: '~1960' },
  { number: 20, title: 'The End', yearRange: '~1970' },
];

export function getCharactersAtChapter(chapter: number): Character[] {
  return characters.filter(c => c.birthChapter <= chapter);
}

export function getCharacterStatus(character: Character, chapter: number): 'not_born' | 'alive_young' | 'alive_aged' | 'deceased' {
  if (chapter < character.birthChapter) {
    return 'not_born';
  }
  if (character.deathChapter && chapter >= character.deathChapter) {
    return 'deceased';
  }
  const chaptersAlive = chapter - character.birthChapter;
  if (chaptersAlive > 5) {
    return 'alive_aged';
  }
  return 'alive_young';
}
