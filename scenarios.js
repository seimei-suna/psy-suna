/* ==========================================================================
   SEIMEI - SUNA: BANQUE COMPLÈTE DE 100 SCÉNARIOS CLINIQUE & COMBAT
   Chaque scénario : desc (mise en situation concrète, lue par le patient
   en auto-test ou par le psychologue à l'oral) + evalTips (indices
   cliniques, psychologue uniquement) + attendu (réaction de référence
   pour situer la notation 0-3, psychologue uniquement — jamais montré
   au patient, y compris en auto-test).
   ========================================================================== */

const FULL_100_SCENARIOS_BANK = [
    // --------------------------------------------------------------------------
    // CATEGORIE 1 : DILEMME MORAL (1 à 25)
    // --------------------------------------------------------------------------
    {
        id: 'sc-1',
        category: 'Dilemme Moral',
        title: 'Priorité à un civil en danger',
        desc: 'Votre escouade progresse en silence vers un point d\'observation stratégique lorsque vous repérez, à 80 mètres sur votre droite, un civil blessé au sol tentant de ramper hors de portée de trois mercenaires armés. La mission de reconnaissance en cours est jugée prioritaire par l\'état-major et toute intervention risque de révéler votre position à une patrouille ennemie postée non loin. Vous avez moins de dix secondes pour décider avant que les mercenaires n\'atteignent le civil.',
        evalTips: 'Observer le délai d\'hésitation, le sens de l\'empathie face à la priorité tactique, et la qualité de l\'argumentation a posteriori de la décision.',
        attendu: 'Une réponse jugée adaptée articule une décision rapide et assumée : soit une intervention brève et maîtrisée limitant l\'exposition (neutralisation silencieuse, extraction rapide), soit un choix conscient de poursuivre la mission avec une justification claire du coût moral accepté, sans déni ni indifférence affichée.'
    },
    {
        id: 'sc-2',
        category: 'Dilemme Moral',
        title: 'Sauver un allié ou terminer l\'objectif',
        desc: 'Lors d\'une fuite précipitée après un accrochage, votre coéquipier Renji est piégé sous les décombres d\'un mur effondré, la jambe coincée sous une poutre de pierre. Vous transportez des documents stratégiques dont la livraison avant le coucher du soleil conditionne le succès d\'une opération plus large impliquant plusieurs escouades. Le dégager prendrait environ quinze minutes que vous n\'avez pas si vous voulez tenir le délai.',
        evalTips: 'Évaluer la pondération de la vie humaine face à l\'objectif militaire institutionnel, et la vitesse de bascule vers une solution alternative.',
        attendu: 'Le shinobi apte cherche activement une troisième voie (envoyer un messager, dégager en urgence par la force, demander du renfort par signal) plutôt que de figer sur un choix binaire, et explique clairement la hiérarchisation retenue si aucune alternative n\'existe.'
    },
    {
        id: 'sc-3',
        category: 'Dilemme Moral',
        title: 'Désobéir pour sauver une vie',
        desc: 'L\'ordre de repli immédiat vient de tomber par signal de fumée : toute l\'unité doit se replier sans délai vers la ligne arrière. En scrutant le champ derrière vous, vous apercevez Kaito, un camarade de promotion, inconscient à environ 50 mètres de la position ennemie qui avance. Retourner le chercher signifie désobéir frontalement à un ordre de commandement et s\'exposer seul en terrain découvert.',
        evalTips: 'Évaluer la prise de risque personnelle assumée, le rapport au serment d\'obéissance, et la solidité de la justification du choix devant la hiérarchie.',
        attendu: 'Une réaction saine montre un temps de décision court mais non impulsif, une tentative de minimiser le risque (couverture, itinéraire dérobé) plutôt qu\'une charge frontale suicidaire, et une capacité à assumer ensuite la responsabilité de la désobéissance devant le commandement.'
    },
    {
        id: 'sc-4',
        category: 'Dilemme Moral',
        title: 'Survie personnelle ou réussite de mission',
        desc: 'Le pont de pierre franchissant la gorge du Kaze est le seul passage praticable pour les renforts ennemis. Le faire sauter bloquera leur avancée pendant plusieurs jours, mais le mécanisme de mise à feu est défectueux et nécessite une activation manuelle à moins de dix mètres de la charge, laissant très peu de temps pour s\'extraire de la zone de souffle avant la détonation.',
        evalTips: 'Mesurer la résilience extrême face au risque létal direct, l\'équilibre entre altruisme patriotique et instinct de conservation, et la lucidité technique dans l\'exécution.',
        attendu: 'La réponse jugée adaptée montre une évaluation technique concrète (calcul de la distance de sécurité, recherche d\'un délai de mise à feu, protection improvisée) plutôt qu\'un sacrifice fataliste immédiat ou, à l\'inverse, un refus pur et simple sans recherche de solution intermédiaire.'
    },
    {
        id: 'sc-5',
        category: 'Dilemme Moral',
        title: 'Le convoi médical d\'urgence',
        desc: 'Votre escouade escorte une caisse scellée contenant le seul stock de sérum antipoison disponible pour la garnison de Suna, où une trentaine de soldats sont en train de succomber à une morsure de vipère des sables. En chemin, un éclaireur signale qu\'un village voisin, sans défense, subit une attaque de brigands en ce moment même. Dévier de la route rallongerait le trajet de plusieurs heures.',
        evalTips: 'Évaluer la capacité à hiérarchiser des urgences absolues concurrentes et la gestion de la culpabilité liée au choix non retenu.',
        attendu: 'Un shinobi apte formule une priorité argumentée (nombre de vies en jeu, caractère différable ou non de chaque urgence), envisage un partage des forces si l\'escouade le permet, et ne reste pas figé par la culpabilité une fois la décision prise.'
    },
    {
        id: 'sc-6',
        category: 'Dilemme Moral',
        title: 'Sacrifice d\'équipement légendaire',
        desc: 'Pour ralentir une troupe de poursuite ennemie approchant rapidement, vous devez abandonner ou détruire les marionnettes de combat ayant appartenu au grand-père de votre coéquipière Yuna, léguées au village comme pièces historiques de la maîtrise Kugutsu. Les utiliser comme obstacle piégé garantirait plusieurs minutes d\'avance supplémentaires, mais les détruirait irrémédiablement.',
        evalTips: 'Évaluer le détachement matériel au profit de la survie collective, et la façon de gérer la réaction émotionnelle probable de la propriétaire de l\'objet.',
        attendu: 'La réponse adaptée priorise la survie du groupe sur la valeur symbolique, tout en reconnaissant explicitement le poids affectif de la perte et en proposant un geste de reconnaissance envers Yuna plutôt que de balayer la question.'
    },
    {
        id: 'sc-7',
        category: 'Dilemme Moral',
        title: 'Recours au Jutsu à contrecoup',
        desc: 'L\'avant-poste frontalier est sur le point d\'être submergé par une vague d\'assaillants supérieure en nombre. Vous maîtrisez une technique interdite capable de repousser l\'ennemi en quelques secondes, mais son usage épuisera durablement votre réserve de chakra et laissera des séquelles physiques nécessitant plusieurs semaines de convalescence.',
        evalTips: 'Observer la capacité d\'abnégation, le sens du sacrifice mesuré, et si le shinobi épuise cette option en dernier recours ou trop précocement.',
        attendu: 'Le shinobi apte réserve ce type de technique aux situations réellement désespérées, après avoir tenté des alternatives moins coûteuses, et anticipe verbalement les conséquences de son propre affaiblissement pour l\'équipe qui devra le protéger ensuite.'
    },
    {
        id: 'sc-8',
        category: 'Dilemme Moral',
        title: 'Le choix du messager',
        desc: 'Un seul shinobi peut franchir les lignes ennemies pour prévenir Sunagakure de l\'imminence d\'une attaque. Deux volontaires se présentent : Haru, plus rapide et endurant, et Sora, votre ami proche, légèrement blessé au bras mais qui insiste pour partir malgré la douleur visible sur son visage.',
        evalTips: 'Observer la lucidité tactique non biaisée par l\'attachement personnel, et la capacité à prononcer un choix impopulaire.',
        attendu: 'Une réponse saine retient le critère objectif de réussite de la mission (aptitude physique réelle) plutôt que l\'affinité personnelle, tout en gérant avec tact le refus adressé à l\'ami blessé.'
    },
    {
        id: 'sc-9',
        category: 'Dilemme Moral',
        title: 'Partage des rations d\'eau en zone aride',
        desc: 'Il reste trois gourdes pour six membres d\'escouade, et la prochaine oasis se trouve à plus de deux jours de marche dans le désert. Deux membres montrent déjà des signes de déshydratation avancée, tandis que les autres tiennent encore relativement bien. Vous devez décider de la répartition.',
        evalTips: 'Mesurer la capacité de justice distributive et l\'altruisme sous détresse physique personnelle.',
        attendu: 'La réponse adaptée priorise objectivement les plus vulnérables physiologiquement plutôt qu\'une égalité stricte ou un accaparement personnel, et communique la règle de répartition ouvertement au groupe pour éviter les tensions.'
    },
    {
        id: 'sc-10',
        category: 'Dilemme Moral',
        title: 'Évacuation des civils blessés',
        desc: 'Votre escouade escorte une trentaine de villageois fuyant une zone de combat. Plusieurs traînards, dont une femme âgée et un enfant blessé au pied, ralentissent considérablement la marche alors qu\'une tempête de sable de grande ampleur est annoncée dans moins de deux heures, menaçant de tous les ensevelir si le groupe n\'atteint pas l\'abri rocheux à temps.',
        evalTips: 'Évaluer le sens du devoir humanitaire sous contrainte temporelle extrême et l\'ingéniosité logistique déployée.',
        attendu: 'Le shinobi apte cherche des solutions logistiques concrètes (portage, relais, redistribution des charges) avant d\'envisager d\'abandonner quiconque, et communique honnêtement les risques au groupe plutôt que de dissimuler l\'urgence.'
    },
    {
        id: 'sc-11',
        category: 'Dilemme Moral',
        title: 'Neutralisation d\'un ancien camarade déserteur',
        desc: 'Un renseignement confirme qu\'un déserteur transmet à l\'ennemi les horaires de patrouille de votre village. En arrivant sur place pour l\'intercepter, vous reconnaissez Daisuke, un ami d\'enfance de l\'académie ninja avec qui vous avez partagé vos premières missions. Il vous fait face, visiblement conscient d\'être découvert.',
        evalTips: 'Observer le détachement émotionnel nécessaire, l\'impartialité institutionnelle, et la gestion du choc de la reconnaissance.',
        attendu: 'Une réponse saine reconnaît explicitement le trouble émotionnel ressenti sans le laisser dicter l\'action, applique la procédure institutionnelle prévue (arrestation plutôt qu\'exécution sommaire si la situation le permet), et ne minimise ni la gravité des faits ni le lien affectif.'
    },
    {
        id: 'sc-12',
        category: 'Dilemme Moral',
        title: 'Utilisation d\'une source d\'eau polluée',
        desc: 'Après trois jours sans ravitaillement, votre unité découvre un point d\'eau dont la couleur trouble et l\'odeur suggèrent une contamination possible, peut-être par du bétail mort en amont. Sans elle, le risque de choc thermique et d\'inconscience dans les douze prochaines heures est élevé pour au moins deux membres du groupe.',
        evalTips: 'Analyser la gestion des risques physiologiques et le pragmatisme de survie face à une incertitude sanitaire.',
        attendu: 'La réponse adaptée cherche à réduire le risque avant de consommer (filtration rudimentaire, ébullition si possible) plutôt qu\'un choix binaire entre abstinence totale et consommation brute, et priorise l\'eau pour les cas les plus critiques en premier.'
    },
    {
        id: 'sc-13',
        category: 'Dilemme Moral',
        title: 'Livraison de prisonniers de guerre',
        desc: 'Trois prisonniers ennemis capturés lors de l\'accrochage précédent, affaiblis et visiblement épuisés, vous supplient de les relâcher dans le désert plutôt que de les transférer au centre de détention de Suna, où ils redoutent un traitement sévère. Le protocole militaire exige formellement leur transfert sous escorte.',
        evalTips: 'Évaluer la déontologie militaire, l\'absence de vengeance personnelle, et la fermeté face à la manipulation émotionnelle potentielle.',
        attendu: 'Le shinobi apte applique le protocole tout en traitant les prisonniers avec un minimum d\'humanité (eau, soins de base), sans céder à la pression émotionnelle ni basculer dans la dureté gratuite.'
    },
    {
        id: 'sc-14',
        category: 'Dilemme Moral',
        title: 'Destruction d\'un pont d\'approvisionnement civil',
        desc: 'L\'état-major ordonne de faire sauter le pont de Kirisame, seule voie reliant un village agricole à ses terres cultivées, afin de couper les lignes de ravitaillement ennemies transitant par cette route. La destruction plongera également plusieurs dizaines de familles civiles dans l\'isolement pour la durée de la reconstruction.',
        evalTips: 'Mesurer la capacité à assumer les dommages collatéraux stratégiques et à en anticiper les conséquences humaines.',
        attendu: 'Une réponse mature exécute l\'ordre tout en signalant explicitement la conséquence civile à la hiérarchie et en proposant, si possible, des mesures d\'atténuation (délai d\'évacuation, avertissement préalable au village).'
    },
    {
        id: 'sc-15',
        category: 'Dilemme Moral',
        title: 'Révélation d\'une erreur de commandement',
        desc: 'Vous constatez que l\'ordre tactique donné par le capitaine lors du dernier assaut, fondé sur une lecture erronée du terrain, a directement causé la mort de deux genins. Le rapport officiel en préparation peut soit couvrir discrètement cette erreur pour préserver la réputation du capitaine, soit rapporter fidèlement les faits au conseil militaire.',
        evalTips: 'Évaluer l\'honnêteté intellectuelle, l\'intégrité envers l\'institution, et la capacité à rapporter sans intention de nuire personnellement.',
        attendu: 'Le shinobi apte privilégie une transmission factuelle et non vindicative des événements au conseil, en distinguant clairement le compte-rendu objectif d\'une volonté de sanction personnelle.'
    },
    {
        id: 'sc-16',
        category: 'Dilemme Moral',
        title: 'Protection d\'une relique culturelle',
        desc: 'Un incendie se propage dans l\'aile est de l\'archive du village où est conservé un parchemin fondateur de Sunagakure, symbole important pour la population. Au même moment, une patrouille de trois jeunes genins en exercice signale être prise sous le feu à l\'autre bout du complexe. Le temps ne permet pas de traiter les deux urgences.',
        evalTips: 'Pondérer la valeur symbolique et historique face à la vie humaine directement menacée.',
        attendu: 'Une réponse jugée adaptée place la protection de vies humaines au-dessus de la valeur patrimoniale, tout en signalant immédiatement l\'incendie pour qu\'une autre équipe puisse intervenir sur le parchemin.'
    },
    {
        id: 'sc-17',
        category: 'Dilemme Moral',
        title: 'Attaque préventive sur un camp indécis',
        desc: 'Un groupe armé d\'une dizaine d\'individus non identifiés approche de la frontière de Suna en formation dispersée, sans qu\'il soit possible de déterminer avec certitude s\'il s\'agit d\'une caravane armée pour se défendre ou d\'une force d\'invasion. Attaquer en premier neutraliserait tout risque, mais violerait potentiellement le droit de passage.',
        evalTips: 'Évaluer la doctrine de légitime défense face à l\'impulsivité préventive, et la capacité à temporiser sous incertitude.',
        attendu: 'Le shinobi apte cherche activement à confirmer les intentions ennemies (observation, sommation, contact radio) avant d\'engager, plutôt que de frapper par précaution pure, sauf indice tangible d\'hostilité imminente.'
    },
    {
        id: 'sc-18',
        category: 'Dilemme Moral',
        title: 'Soigner un ennemi agonisant',
        desc: 'Un shinobi ennemi gravement blessé lors de l\'affrontement détient dans sa mémoire la localisation d\'un piège tendu plus loin sur votre route. Il perd rapidement connaissance. Vos réserves de soins d\'urgence sont limitées et un coéquipier de votre camp, blessé également, pourrait en avoir besoin sous peu.',
        evalTips: 'Analyser la gestion des ressources médicales d\'urgence et l\'équilibre entre priorité alliée et valeur du renseignement.',
        attendu: 'Une réponse adaptée cherche d\'abord à obtenir l\'information rapidement par d\'autres moyens (pression verbale, promesse) avant d\'épuiser des soins critiques, et réserve en priorité les ressources limitées à l\'allié si le choix devient binaire.'
    },
    {
        id: 'sc-19',
        category: 'Dilemme Moral',
        title: 'Sabotage d\'une oasis occupée',
        desc: 'Une garnison ennemie s\'est installée autour de la seule oasis de la région, coupant l\'accès à l\'eau pour plusieurs villages alentour. Il est proposé de contaminer temporairement la source pour forcer leur retrait, sachant que l\'eau redeviendra potable après quelques jours, mais que des civils pourraient également en consommer par erreur avant cela.',
        evalTips: 'Évaluer la limite acceptée des tactiques de guerre non conventionnelles et la prise en compte du risque civil induit.',
        attendu: 'Le shinobi apte n\'écarte pas l\'option d\'emblée mais exige des garanties concrètes (signalisation, délai, information des civils) avant exécution, montrant qu\'il pèse le rapport bénéfice tactique / risque civil plutôt que d\'agir sans filtre.'
    },
    {
        id: 'sc-20',
        category: 'Dilemme Moral',
        title: 'Refus de l\'euthanasie de combat',
        desc: 'Votre coéquipier Ren, grièvement éventré lors du dernier affrontement, vous supplie entre deux respirations sifflantes de l\'achever plutôt que de ralentir la fuite du groupe et risquer la vie de tous face à l\'ennemi qui approche. Le transporter le maintiendrait en vie mais réduirait votre vitesse de repli de moitié.',
        evalTips: 'Observer la résistance à la pression morale extrême et la recherche active de solutions de sauvetage alternatives.',
        attendu: 'Une réponse saine résiste au réflexe d\'acquiescer immédiatement, cherche une solution de transport ou de diversion avant d\'envisager l\'irréversible, et reste capable d\'exprimer la difficulté émotionnelle de la situation plutôt que de la traiter froidement.'
    },
    {
        id: 'sc-21',
        category: 'Dilemme Moral',
        title: 'Vol de provisions d\'un marchand itinérant',
        desc: 'Après plusieurs jours sans ravitaillement, votre unité déshydratée et affaiblie repère une caravane marchande privée, sans escorte armée, transportant visiblement des vivres et de l\'eau en abondance. Prendre ce dont vous avez besoin par la force serait rapide et sans risque de combat, mais constituerait un vol pur envers des civils.',
        evalTips: 'Évaluer le respect du droit des civils face à un besoin biologique urgent et réel.',
        attendu: 'Le shinobi apte privilégie une négociation ou un échange (reconnaissance de dette, troc) plutôt qu\'une réquisition forcée, sauf si l\'urgence vitale est immédiate et documentée, auquel cas il consigne l\'acte pour compensation ultérieure.'
    },
    {
        id: 'sc-22',
        category: 'Dilemme Moral',
        title: 'Rapport sur la faiblesse psychologique d\'un équipier',
        desc: 'Lors du dernier assaut, vous avez observé votre coéquipier Aito figé plusieurs secondes en pleine crise de panique, ce qui a failli coûter la vie à un autre membre de l\'escouade. Le rapport de mission officiel demande une évaluation complète du comportement de chacun, et signaler cet épisode pourrait entraîner la rétrogradation d\'Aito.',
        evalTips: 'Observer la loyauté envers l\'équipe face à la sécurité des missions futures, et la capacité à séparer fait et jugement.',
        attendu: 'Une réponse adaptée rapporte les faits observés de façon factuelle sans les dramatiser ni les taire, tout en suggérant un accompagnement plutôt qu\'une sanction pure, montrant un souci simultané de la vérité et du camarade.'
    },
    {
        id: 'sc-23',
        category: 'Dilemme Moral',
        title: 'Choix de l\'itinéraire de repli',
        desc: 'Deux chemins de retraite s\'offrent à votre escouade : une passe montagneuse instable où plusieurs éboulements ont déjà été signalés cette semaine, ou une vallée dégagée où un tireur d\'élite ennemi a été repéré la veille. Chaque option comporte un risque mortel différent et le temps de réflexion est très limité.',
        evalTips: 'Analyser l\'acceptation comparée du risque environnemental face au risque humain armé, et la rapidité de la décision.',
        attendu: 'Le shinobi apte compare objectivement les probabilités réelles de chaque danger plutôt que de choisir par instinct, et adapte la formation du groupe (dispersion, couverture) au risque retenu.'
    },
    {
        id: 'sc-24',
        category: 'Dilemme Moral',
        title: 'Embauche d\'un guide douteux',
        desc: 'Bloquée devant un champ de mines de sable récemment posé, votre unité croise un contrebandier recherché par Suna pour trafic d\'armes, qui prétend connaître un passage sûr et propose ses services contre rémunération. Faire appel à lui reviendrait à collaborer temporairement avec un criminel activement recherché.',
        evalTips: 'Évaluer le pragmatisme tactique sous contrainte vitale et la gestion du compromis éthique assumé.',
        attendu: 'Une réponse mature accepte l\'aide si aucune alternative fiable n\'existe, tout en encadrant strictement l\'interaction (surveillance, absence de récompense au-delà du nécessaire) et en rapportant ensuite la collaboration à la hiérarchie plutôt que de la dissimuler.'
    },
    {
        id: 'sc-25',
        category: 'Dilemme Moral',
        title: 'Se rendre pour sauver son équipe',
        desc: 'Trois jeunes genins sous votre responsabilité sont encerclés par une force ennemie très supérieure. Le commandant adverse propose leur libération immédiate en échange de votre capture personnelle et de votre reddition sans résistance, sachant votre statut d\'officier gradé recherché.',
        evalTips: 'Mesurer le sens ultime de la responsabilité de commandement et la capacité à sacrifier son propre statut pour ses subordonnés.',
        attendu: 'Le shinobi apte envisage sérieusement l\'échange comme option légitime de dernier recours, tout en tentant d\'abord d\'obtenir des garanties sur le sort des genins et en explorant brièvement une alternative de sauvetage avant de s\'y résoudre.'
    },

    // --------------------------------------------------------------------------
    // CATEGORIE 2 : COMMANDEMENT & DISCIPLINE (26 à 50)
    // --------------------------------------------------------------------------
    {
        id: 'sc-26',
        category: 'Commandement & Discipline',
        title: 'Recevoir un ordre contestable',
        desc: 'Votre supérieur direct ordonne d\'abandonner un point de refuge où se sont réfugiés une dizaine de civils, afin de maintenir la vitesse de marche de l\'escouade vers son objectif principal. L\'ordre est parfaitement légal au regard du règlement militaire, mais vous le jugez moralement discutable compte tenu de la vulnérabilité des civils laissés sans protection.',
        evalTips: 'Analyser la capacité d\'obéissance réfléchie, le respect de la hiérarchie, et les formes de contestation employées (canal, ton, moment).',
        attendu: 'Une réponse saine exprime son désaccord par la voie hiérarchique appropriée (question, remarque argumentée) sans désobéissance ouverte ni soumission silencieuse ressentie comme injuste, et exécute l\'ordre final une fois la décision confirmée.'
    },
    {
        id: 'sc-27',
        category: 'Commandement & Discipline',
        title: 'Conflit avec un supérieur',
        desc: 'Lors d\'un briefing tendu en pleine phase de combat actif, deux officiers responsables de votre secteur s\'opposent frontalement sur la stratégie à adopter, chacun exigeant votre soutien immédiat pour trancher en sa faveur. Le ton monte et l\'ambiance devient hostile devant le reste de l\'unité.',
        evalTips: 'Observer le tact professionnel, l\'évitement des biais personnels, et le recentrage sur l\'intérêt opérationnel de Suna plutôt que sur les egos en présence.',
        attendu: 'Le shinobi apte évite de prendre parti sur des critères personnels, ramène la discussion vers des critères tactiques objectifs, et respecte la décision finale du plus gradé une fois celle-ci rendue, sans ressentiment affiché.'
    },
    {
        id: 'sc-28',
        category: 'Commandement & Discipline',
        title: 'Conflit de juridiction au poste frontière',
        desc: 'Une patrouille d\'un village allié refuse catégoriquement l\'accès à une oasis frontalière, invoquant des soupçons d\'espionnage envers votre escouade. Vos réserves d\'eau sont pourtant au plus bas et le prochain point de ravitaillement se trouve à plus d\'une journée de marche.',
        evalTips: 'Observer la retenue diplomatique, le contrôle de la frustration ou de la colère, et l\'art de la négociation en contexte de tension inter-villages.',
        attendu: 'Une réponse adaptée privilégie la désescalade verbale et la recherche de preuves rassurantes (identification, canal officiel) avant d\'envisager la force, en gardant à l\'esprit les conséquences diplomatiques d\'un incident frontalier.'
    },
    {
        id: 'sc-29',
        category: 'Commandement & Discipline',
        title: 'Ordre de retraite précipitée',
        desc: 'L\'état-major ordonne un repli immédiat et sans délai de toute la garnison avancée, ce qui implique d\'abandonner sur place le matériel lourd et les provisions de secours durement acheminées la veille. L\'ordre ne laisse aucune marge de négociation ni d\'explication supplémentaire.',
        evalTips: 'Mesurer l\'obéissance immédiate aux ordres de haut niveau sans contestation stérile, tout en évaluant si une remontée d\'information ultérieure est appropriée.',
        attendu: 'Le shinobi apte exécute sans délai tout en notant mentalement les pertes matérielles pour un rapport ultérieur, sans perdre de temps précieux à discuter la légitimité de l\'ordre sur le moment.'
    },
    {
        id: 'sc-30',
        category: 'Commandement & Discipline',
        title: 'Querelle d\'ego au sein de l\'escouade',
        desc: 'Deux shinobis de rang équivalent, Sato et Miki, refusent ouvertement de coordonner la mise en place d\'un piège tactique essentiel à la défense du campement, un vieux différend personnel les opposant depuis leur formation commune. Le piège doit être achevé avant la tombée de la nuit.',
        evalTips: 'Observer les qualités de médiation, la fermeté nécessaire, et le maintien de l\'esprit d\'équipe malgré les tensions interpersonnelles.',
        attendu: 'Une réponse saine sépare temporairement les deux protagonistes sur des tâches complémentaires plutôt que de les forcer à coopérer sous tension, tout en fixant un cadre ferme rappelant la priorité de la mission sur le conflit personnel.'
    },
    {
        id: 'sc-31',
        category: 'Commandement & Discipline',
        title: 'Gestion d\'un acte d\'insubordination mineur',
        desc: 'Un jeune genin sous votre supervision refuse d\'effectuer son tour de garde nocturne, invoquant une fatigue extrême après deux jours de marche forcée. Son état semble réellement critique, mais le refus pur et simple d\'un ordre pose un problème disciplinaire que le reste de l\'escouade observe attentivement.',
        evalTips: 'Évaluer la fermeté disciplinaire tempérée par la prise en compte réaliste de l\'état physique du subordonné.',
        attendu: 'Le shinobi apte évalue concrètement l\'état du genin avant de trancher, propose un aménagement (échange de tour, garde partagée) plutôt qu\'une sanction automatique, tout en clarifiant que le refus d\'ordre reste à encadrer pour l\'avenir.'
    },
    {
        id: 'sc-32',
        category: 'Commandement & Discipline',
        title: 'Désignation du chef d\'escouade par intérim',
        desc: 'Le chef d\'escouade vient d\'être mis hors de combat par une blessure sérieuse. Deux membres de rang équivalent revendiquent immédiatement la direction des opérations, chacun avec des arguments tactiques différents, alors que l\'ennemi reste actif à proximité.',
        evalTips: 'Observer la capacité à s\'imposer par le calme et la légitimité tactique plutôt que par l\'autorité brute.',
        attendu: 'Une réponse adaptée tranche rapidement sur un critère objectif (ancienneté, expérience du terrain, clarté du plan proposé) plutôt que de laisser le flottement s\'installer, et rallie l\'autre prétendant à une position claire dans la nouvelle chaîne de commandement.'
    },
    {
        id: 'sc-33',
        category: 'Commandement & Discipline',
        title: 'Respect du couvre-feu au campement',
        desc: 'Vous constatez que deux shinobis ont allumé un feu de camp non autorisé pour se réchauffer, en pleine zone où des patrouilles ennemies sont susceptibles de circuler la nuit. La lueur est visible à plusieurs centaines de mètres et met en danger l\'ensemble du campement.',
        evalTips: 'Mesurer la réactivité du rappel à l\'ordre pour la sécurité collective et la fermeté sans excès disproportionné.',
        attendu: 'Le shinobi apte fait éteindre le feu immédiatement et fermement, explique brièvement le risque encouru par tous, sans humilier publiquement les fautifs au-delà de ce qui est nécessaire à la discipline.'
    },
    {
        id: 'sc-34',
        category: 'Commandement & Discipline',
        title: 'Sanction d\'une faute collective',
        desc: 'L\'ensemble de la patrouille a omis, par négligence collective, de vérifier l\'étanchéité des parchemins de réserve avant de traverser une zone humide, rendant plusieurs techniques de scellement inutilisables au moment critique où elles auraient pu servir.',
        evalTips: 'Évaluer le sens de la responsabilité partagée et la pédagogie du commandement face à une faute diffuse plutôt qu\'individuelle.',
        attendu: 'Une réponse mature traite la faute comme un problème de procédure collective à corriger plutôt que de chercher un bouc émissaire, et instaure une vérification systématique future plutôt qu\'une sanction punitive isolée.'
    },
    {
        id: 'sc-35',
        category: 'Commandement & Discipline',
        title: 'Exécution d\'une consigne d\'urgence ambiguë',
        desc: 'Le message transmis par pigeon voyageur contient une faute de frappe critique sur les coordonnées du point de ralliement, rendant deux interprétations possibles à quelques kilomètres d\'écart l\'une de l\'autre, avec un délai très court avant l\'heure prévue du regroupement.',
        evalTips: 'Analyser l\'esprit d\'initiative sous ambiguïté des ordres reçus et la capacité à sécuriser un choix malgré l\'incertitude.',
        attendu: 'Le shinobi apte croise rapidement l\'information avec le contexte connu (mission, terrain, historique des points de ralliement) plutôt que de rester paralysé par l\'ambiguïté, et prévoit un plan de repli si son interprétation s\'avère fausse.'
    },
    {
        id: 'sc-36',
        category: 'Commandement & Discipline',
        title: 'Gestion des retards d\'entraînement',
        desc: 'Un shinobi de votre unité s\'absente régulièrement des exercices tactiques de groupe depuis plusieurs semaines, sans jamais fournir de motif médical ou d\'explication claire, ce qui commence à affecter la cohésion et la préparation collective de l\'escouade.',
        evalTips: 'Observer l\'approche d\'entretien individuel privilégiée et le recadrage professionnel plutôt qu\'un jugement hâtif.',
        attendu: 'Une réponse adaptée engage un entretien individuel discret pour comprendre la cause avant toute sanction, tout en fixant clairement les attentes et les conséquences si la situation persiste sans justification.'
    },
    {
        id: 'sc-37',
        category: 'Commandement & Discipline',
        title: 'Contestation d\'une affectation de poste',
        desc: 'Un shinobi spécialisé dans les attaques à distance de haute précision se retrouve affecté à la garde statique de la porte Sud, un poste qui n\'exploite en rien ses compétences particulières, et exprime ouvertement sa frustration face à cette décision qu\'il juge inefficace pour le village.',
        evalTips: 'Pondérer l\'acceptation disciplinée de la tâche assignée face à une suggestion légitime d\'optimisation des ressources.',
        attendu: 'Le shinobi apte remonte la remarque par la voie appropriée en argumentant sur l\'efficacité collective plutôt que sur sa préférence personnelle, tout en continuant à exécuter la tâche assignée sans relâchement en attendant une réponse.'
    },
    {
        id: 'sc-38',
        category: 'Commandement & Discipline',
        title: 'Rapport sur une violation de protocole',
        desc: 'Vous découvrez qu\'un sous-officier de votre unité a partagé la fréquence radio confidentielle de l\'escouade avec des mercenaires locaux en échange d\'informations sur le terrain, une violation sérieuse des protocoles de sécurité des communications stratégiques.',
        evalTips: 'Évaluer la rigueur appliquée à la sécurité des communications et la fermeté du signalement malgré d\'éventuels liens personnels.',
        attendu: 'Une réponse saine signale immédiatement la violation à la hiérarchie compétente, sans tenter de gérer seul une faute de cette gravité ni de la couvrir par loyauté de corps mal placée.'
    },
    {
        id: 'sc-39',
        category: 'Commandement & Discipline',
        title: 'Gestion du manque de respect hiérarchique',
        desc: 'Un genin particulièrement talentueux remet publiquement en cause, lors du briefing, les compétences tactiques d\'un vétéran expérimenté de l\'escouade, créant un malaise visible parmi les autres membres présents et fragilisant l\'autorité naturelle de l\'ancien.',
        evalTips: 'Mesurer la gestion du respect dû aux aînés et le maintien de la cohésion d\'unité sans écraser l\'initiative du plus jeune.',
        attendu: 'Le shinobi apte recadre la forme de l\'intervention publiquement, tout en reconnaissant en privé si le fond de la remarque du genin avait une part de validité, équilibrant respect hiérarchique et écoute des idées nouvelles.'
    },
    {
        id: 'sc-40',
        category: 'Commandement & Discipline',
        title: 'Ordre de destruction de matériel allié',
        desc: 'L\'ordre tombe de détruire les tourelles de défense automatiques du poste Ouest avant que celui-ci ne tombe aux mains de l\'ennemi, du matériel coûteux et difficile à remplacer que vous avez vous-même contribué à installer quelques semaines plus tôt.',
        evalTips: 'Évaluer l\'exécution froide et rapide des ordres de terre brûlée malgré l\'investissement personnel dans le matériel concerné.',
        attendu: 'Une réponse adaptée exécute l\'ordre sans tergiversation excessive, la logique de terre brûlée primant sur l\'attachement au matériel, tout en documentant la perte pour la reconstruction future.'
    },
    {
        id: 'sc-41',
        category: 'Commandement & Discipline',
        title: 'Maintien de la discipline en captivité',
        desc: 'Capturé avec le reste de votre escouade dans un camp ennemi, vous devez maintenir le moral et l\'ordre intérieur des troupes de Suna détenues, alors que les conditions de privation (nourriture rationnée, isolement, incertitude sur le sort réservé) sapent progressivement la résistance psychologique du groupe.',
        evalTips: 'Observer la résilience de commandement dans des conditions de privation absolue et la capacité à préserver l\'espoir collectif sans mentir.',
        attendu: 'Le shinobi apte structure le temps du groupe (routines, petites responsabilités, entraide) pour préserver le moral, sans faire de fausses promesses sur une libération imminente non confirmée.'
    },
    {
        id: 'sc-42',
        category: 'Commandement & Discipline',
        title: 'Intégration d\'une recrue indisciplinée',
        desc: 'Un shinobi réputé difficile à encadrer, doté cependant d\'un jutsu exceptionnel rarement maîtrisé dans le village, rejoint votre escouade. Ses premiers jours confirment sa réputation : il conteste les consignes de base et agit souvent en solo lors des exercices.',
        evalTips: 'Évaluer les qualités d\'intégration et d\'encadrement de talents complexes sans étouffer leur potentiel ni laisser l\'indiscipline s\'installer.',
        attendu: 'Une réponse adaptée fixe un cadre clair et non négociable sur les règles de sécurité collective, tout en valorisant explicitement le talent de la recrue pour l\'inciter à s\'investir plutôt qu\'à se braquer.'
    },
    {
        id: 'sc-43',
        category: 'Commandement & Discipline',
        title: 'Gestion du sommeil lors des gardes croisées',
        desc: 'Vous devez organiser les tours de garde nocturne alors qu\'environ la moitié de l\'effectif souffre d\'insomnie liée au stress accumulé des derniers jours de combat, réduisant dangereusement la vigilance disponible pour surveiller le campement.',
        evalTips: 'Analyser la capacité de gestion logistique et de vigilance physique de l\'unité sous fatigue cumulée.',
        attendu: 'Le shinobi apte réorganise les tours en fonction de l\'état réel de chacun plutôt qu\'un roulement automatique, en priorisant les plus reposés sur les créneaux les plus critiques et en acceptant une vigilance réduite mais consciente plutôt que niée.'
    },
    {
        id: 'sc-44',
        category: 'Commandement & Discipline',
        title: 'Recadrage d\'un excès de zèle',
        desc: 'Un shinobi de votre escouade a poursuivi seul un ennemi en fuite bien au-delà du périmètre défini par le plan d\'action, exposant tout le groupe qui a dû se réorganiser précipitamment pour couvrir son absence imprévue et risquée.',
        evalTips: 'Observer la capacité à canaliser l\'agressivité tactique individuelle vers la discipline collective sans briser l\'initiative.',
        attendu: 'Une réponse adaptée recadre fermement le comportement en expliquant le risque fait porter au groupe, tout en reconnaissant la valeur du courage sous-jacent pour ne pas décourager toute prise d\'initiative future.'
    },
    {
        id: 'sc-45',
        category: 'Commandement & Discipline',
        title: 'Gestion des rumeurs de défaite au camp',
        desc: 'Des rumeurs non confirmées d\'un encerclement imminent du village central commencent à circuler parmi les troupes de soutien, provoquant une nervosité croissante et des débuts de désorganisation dans les tâches logistiques quotidiennes.',
        evalTips: 'Mesurer la communication rassurante et la lutte active contre la désinformation déstabilisante sans mentir sur la situation réelle.',
        attendu: 'Le shinobi apte cherche à vérifier l\'information avant de la commenter, communique ensuite avec transparence sur ce qui est confirmé ou non, plutôt que de nier en bloc ou de laisser la rumeur enfler sans réponse.'
    },
    {
        id: 'sc-46',
        category: 'Commandement & Discipline',
        title: 'Validation des rapports de patrouille',
        desc: 'En recoupant les carnets de bord remis par l\'escouade Alpha, vous remarquez des incohérences temporelles troublantes entre les heures de passage déclarées et d\'autres observations indépendantes, suggérant soit une erreur de transcription, soit une dissimulation volontaire.',
        evalTips: 'Évaluer le sens de la vérification rigoureuse des données transmises avant d\'en tirer des conclusions hâtives.',
        attendu: 'Une réponse adaptée engage une clarification directe avec l\'escouade concernée avant de conclure à une faute, en distinguant clairement erreur involontaire et manquement délibéré dans son évaluation.'
    },
    {
        id: 'sc-47',
        category: 'Commandement & Discipline',
        title: 'Arbitrage sur la répartition du matériel médical',
        desc: 'Seuls deux kits de premiers soins complets sont disponibles pour équiper quatre sections qui vont opérer séparément en zone à haut risque dans les prochaines heures, chacune ayant un besoin potentiellement vital de ce matériel.',
        evalTips: 'Analyser la rationalisation stratégique des ressources d\'urgence selon des critères objectifs plutôt qu\'arbitraires.',
        attendu: 'Le shinobi apte répartit selon des critères objectifs (niveau de risque de chaque section, présence d\'un médic dans l\'équipe) et communique la logique de répartition pour éviter le sentiment d\'injustice.'
    },
    {
        id: 'sc-48',
        category: 'Commandement & Discipline',
        title: 'Gestion de la panique lors d\'une alerte chimique',
        desc: 'Une fausse alerte aux gaz toxiques se déclenche par erreur dans la garnison, provoquant un mouvement de foule désordonné où plusieurs soldats commencent à se bousculer vers les sorties, créant un risque de blessures par écrasement plus grave que la menace initiale inexistante.',
        evalTips: 'Observer la fermeté vocale et la prise de contrôle rapide du chaos avant qu\'il ne s\'aggrave physiquement.',
        attendu: 'Une réponse adaptée impose immédiatement des instructions claires et fortes pour canaliser le mouvement, vérifie rapidement la réalité de l\'alerte, et communique l\'information corrigée dès que possible pour stopper la panique à la source.'
    },
    {
        id: 'sc-49',
        category: 'Commandement & Discipline',
        title: 'Transmission du commandement sur le champ de bataille',
        desc: 'Blessé et incapable de continuer à diriger efficacement sous le feu direct des tirs de mortier de sable, vous devez transmettre immédiatement le commandement à votre second, en pleine confusion du combat, sans que la transition ne crée de flottement dangereux.',
        evalTips: 'Évaluer la clarté des transmissions de consignes sous stress aigu et la rapidité de la passation.',
        attendu: 'Le shinobi apte transmet en quelques phrases courtes et précises (situation, priorités, position ennemie connue) plutôt qu\'un rapport confus, s\'assurant que le second a bien compris avant de se désengager.'
    },
    {
        id: 'sc-50',
        category: 'Commandement & Discipline',
        title: 'Contrôle des armes de grande puissance',
        desc: 'Vous constatez qu\'un rouleau de scellement lourd, capable d\'une déflagration importante, est entreposé dangereusement près des réserves de carburant du campement, un risque d\'explosion en chaîne que personne d\'autre ne semble avoir remarqué dans l\'urgence de l\'installation.',
        evalTips: 'Mesurer le respect strict des mesures de sécurité incendie et explosion, même sous pression du temps d\'installation.',
        attendu: 'Une réponse adaptée fait déplacer immédiatement le matériel dangereux, sans attendre une validation hiérarchique pour un risque de sécurité aussi évident et immédiat.'
    },

    // --------------------------------------------------------------------------
    // CATEGORIE 3 : GESTION DE CRISE & SURVIE (51 à 75)
    // --------------------------------------------------------------------------
    {
        id: 'sc-51',
        category: 'Gestion de Crise',
        title: 'Réagir à la perte d\'un équipier',
        desc: 'Le capitaine de votre escouade vient d\'être éliminé brutalement sous vos yeux par un tir précis alors que l\'unité se retrouve simultanément encerclée par des forces ennemies, sans instructions claires sur la conduite à tenir dans les secondes qui suivent.',
        evalTips: 'Observer la capacité d\'initiative immédiate, la régulation émotionnelle sous choc traumatique, et la prise de leadership spontanée ou son absence.',
        attendu: 'Le shinobi apte prend ou soutient rapidement une prise de commandement de fait, même bref, pour éviter la sidération collective, en donnant des instructions concrètes plutôt que de rester figé par le choc.'
    },
    {
        id: 'sc-52',
        category: 'Gestion de Crise',
        title: 'Mission compromise et fuite',
        desc: 'L\'opération d\'infiltration vient d\'échouer et l\'alerte a été donnée par l\'ennemi. Deux itinéraires d\'évacuation s\'offrent à vous : traverser une zone désertique dégagée mais risquée en cas de poursuite aérienne, ou passer par un village hôte où votre présence pourrait compromettre des habitants neutres.',
        evalTips: 'Observer l\'évaluation des risques collatéraux et la capacité d\'improvisation en terrain hostile sous pression temporelle.',
        attendu: 'Une réponse adaptée pèse rapidement le risque pour soi-même contre le risque fait porter aux civils du village, et privilégie généralement l\'itinéraire n\'impliquant pas des tiers non concernés, sauf urgence vitale absolue.'
    },
    {
        id: 'sc-53',
        category: 'Gestion de Crise',
        title: 'Piège dans la tempête de sable',
        desc: 'Votre unité est bloquée en pleine tempête de sable à visibilité quasi nulle, incapable de se repérer, lorsque des signaux de détresse d\'origine inconnue commencent à retentir à proximité immédiate, pouvant être un piège tendu par l\'ennemi profitant des conditions.',
        evalTips: 'Analyser la vigilance tactique, le sang-froid en milieu hostile, et la gestion prudente des pièges d\'embuscade potentiels.',
        attendu: 'Le shinobi apte ne se précipite pas vers le signal sans vérification, organise une approche prudente en formation de sécurité, et privilégie l\'attente ou la reconnaissance limitée plutôt qu\'un engagement aveugle.'
    },
    {
        id: 'sc-54',
        category: 'Gestion de Crise',
        title: 'Soupçon de poison ou contamination',
        desc: 'Un coéquipier commence à manifester des signes inquiétants de confusion mentale et de tremblements en plein désert, pouvant indiquer un empoisonnement lent ou une intoxication alimentaire, sans qu\'aucun médecin ne soit présent dans l\'unité pour poser un diagnostic fiable.',
        evalTips: 'Observer la réactivité médicale de premier secours, la mise en quarantaine sécurisée si nécessaire, et la protection du moral du reste de l\'équipe.',
        attendu: 'Une réponse adaptée isole prudemment le camarade affecté, tente d\'identifier la cause probable (nourriture, morsure, eau) pour orienter les premiers soins, et rassure le reste du groupe sans minimiser la gravité potentielle.'
    },
    {
        id: 'sc-55',
        category: 'Gestion de Crise',
        title: 'Rupture totale des liaisons radio',
        desc: 'Toutes les communications avec Sunagakure sont brutalement coupées au moment précis où vous observez un mouvement de troupes suspect se rassemblant à la frontière, une information critique que vous ne pouvez plus transmettre par les canaux habituels.',
        evalTips: 'Évaluer l\'autonomie décisionnelle en l\'absence de validation hiérarchique et le respect de la doctrine militaire en aveugle.',
        attendu: 'Le shinobi apte applique les procédures dégradées prévues (messager, signal alternatif, repli vers un relais connu) plutôt que d\'improviser au hasard, tout en continuant l\'observation tant que la sécurité le permet.'
    },
    {
        id: 'sc-56',
        category: 'Gestion de Crise',
        title: 'Capture de l\'officier supérieur',
        desc: 'Le capitaine de votre escouade a été capturé vivant par un groupe de ninjas déserteurs qui exigent une rançon considérable sous deux heures, faute de quoi ils menacent de l\'exécuter. Aucun renfort ne peut arriver à temps dans ce délai.',
        evalTips: 'Évaluer l\'analyse tactique de sauvetage et la prise d\'initiative en situation d\'urgence extrême sans céder à la panique.',
        attendu: 'Une réponse adaptée évalue rapidement une option de sauvetage réaliste (reconnaissance discrète, ouverture de négociation pour gagner du temps) plutôt qu\'une capitulation immédiate à l\'exigence ou une tentative suicidaire.'
    },
    {
        id: 'sc-57',
        category: 'Gestion de Crise',
        title: 'Marche forcée sous chaleur extrême',
        desc: 'Votre unité doit effectuer quarante-huit heures de marche quasiment ininterrompue à travers le désert sous une température avoisinant 45°C, avec un rationnement d\'eau devenu critique dès la première journée en raison d\'une erreur de calcul initiale des réserves.',
        evalTips: 'Observer la résilience physique et mentale collective, ainsi que l\'entraide spontanée face à l\'épuisement partagé.',
        attendu: 'Le shinobi apte adapte le rythme de marche à l\'état réel du groupe, encourage l\'entraide (portage, partage), et signale honnêtement ses propres limites plutôt que de les dissimuler jusqu\'à l\'effondrement.'
    },
    {
        id: 'sc-58',
        category: 'Gestion de Crise',
        title: 'Attaque nocturne par marionnettes sauvages',
        desc: 'Des automates de combat non identifiés, apparemment livrés à eux-mêmes et hostiles, s\'infiltrent silencieusement dans le campement vers trois heures du matin, alors que la majorité de l\'unité dort profondément après une journée épuisante.',
        evalTips: 'Évaluer la vitesse de réveil opérationnel et l\'organisation spontanée d\'une défense circulaire cohérente.',
        attendu: 'Une réponse adaptée passe en alerte opérationnelle en quelques secondes malgré le réveil brutal, donne l\'alarme au reste du groupe, et organise une défense en formation plutôt qu\'une dispersion désordonnée.'
    },
    {
        id: 'sc-59',
        category: 'Gestion de Crise',
        title: 'Éboulement dans la mine de chakra',
        desc: 'Deux mineurs sont coincés dans une galerie souterraine instable, menaçant de s\'effondrer complètement à tout moment, après un premier éboulement partiel ayant déjà bloqué l\'issue principale. Les bruits de craquement continuent au-dessus de leur tête.',
        evalTips: 'Analyser le sang-froid déployé lors d\'un secours en environnement confiné et objectivement périlleux pour le sauveteur lui-même.',
        attendu: 'Le shinobi apte évalue rapidement la stabilité de la structure avant de s\'engager, privilégie une extraction rapide et méthodique plutôt que précipitée, et accepte d\'interrompre la tentative si le risque devient disproportionné.'
    },
    {
        id: 'sc-60',
        category: 'Gestion de Crise',
        title: 'Incendie au dépôt d\'explosifs',
        desc: 'Un feu se déclare soudainement à une dizaine de mètres seulement des rouleaux de scellement explosifs entreposés dans la garnison, avec un risque d\'explosion en chaîne capable de raser une partie importante du campement en quelques minutes.',
        evalTips: 'Observer la vitesse de réaction et le choix judicieux entre priorité d\'extinction et priorité d\'évacuation selon le temps réellement disponible.',
        attendu: 'Une réponse adaptée donne immédiatement l\'ordre d\'évacuation du périmètre avant toute tentative d\'extinction si le risque d\'explosion est réel et proche, la sécurité des personnes primant sur le sauvetage du matériel.'
    },
    {
        id: 'sc-61',
        category: 'Gestion de Crise',
        title: 'Attaque de scorpion géant du désert',
        desc: 'Une créature venimeuse de grande taille, rarement rencontrée, s\'attaque brusquement aux réserves de nourriture de l\'unité en plein milieu d\'un canyon étroit offrant très peu d\'espace de manœuvre pour esquiver ou contourner l\'animal.',
        evalTips: 'Évaluer l\'adaptation du combat face à une faune hostile indigène inhabituelle plutôt qu\'à un adversaire humain classique.',
        attendu: 'Le shinobi apte adapte sa tactique au terrain confiné (repli vertical, utilisation d\'obstacles) plutôt que d\'engager un combat frontal risqué dans un espace où l\'esquive est limitée.'
    },
    {
        id: 'sc-62',
        category: 'Gestion de Crise',
        title: 'Infiltration de serpents venimeux',
        desc: 'Attirés par la chaleur et le chakra résiduel, plusieurs serpents venimeux se sont glissés durant la nuit dans les sacs de couchage de l\'escouade, découverts seulement au réveil lorsqu\'un des membres sent un mouvement contre sa jambe.',
        evalTips: 'Mesurer le calme sans geste brusque et la maîtrise des réflexes de panique sous peur immédiate et proche.',
        attendu: 'Une réponse adaptée immobilise le geste initial, alerte calmement les autres à voix basse, et procède à une extraction lente et contrôlée plutôt qu\'un mouvement brusque qui provoquerait la morsure.'
    },
    {
        id: 'sc-63',
        category: 'Gestion de Crise',
        title: 'Découverte d\'un champ de mines de sable',
        desc: 'La première ligne de votre patrouille vient de déclencher une détonation sous ses pieds, révélant la présence d\'un champ de mines de sable non signalé jusqu\'alors, avec au moins un blessé au sol et le reste du champ de mines toujours actif autour du groupe.',
        evalTips: 'Analyser l\'arrêt immédiat de la marche générale, le balisage sécurisé du périmètre, et le secours méthodique du ou des blessés.',
        attendu: 'Le shinobi apte fige immédiatement toute progression du groupe, sécurise un couloir de retour connu avant tout mouvement, et n\'approche le blessé qu\'en suivant ses propres traces pour éviter une seconde détonation.'
    },
    {
        id: 'sc-64',
        category: 'Gestion de Crise',
        title: 'Hallucinations dues à la déshydratation',
        desc: 'Deux membres de l\'unité, sévèrement déshydratés, commencent à décrire avec conviction la présence d\'une oasis à l\'horizon et s\'écartent progressivement du groupe pour s\'y diriger, malgré l\'absence de tout point d\'eau visible pour les autres.',
        evalTips: 'Observer la prise en charge médicale et psychologique adaptée face à des délires d\'origine thermique plutôt qu\'un simple rappel à l\'ordre.',
        attendu: 'Une réponse adaptée ramène physiquement et fermement les personnes concernées vers le groupe sans les brusquer inutilement, débute une réhydratation d\'urgence, et surveille leur état plutôt que de les laisser s\'isoler.'
    },
    {
        id: 'sc-65',
        category: 'Gestion de Crise',
        title: 'Fuite à travers une mer de dunes mouvantes',
        desc: 'Poursuivie par des tirs de flèches ennemies, votre unité doit traverser une étendue de sables mouvants instables s\'effondrant progressivement sous le poids de chaque foulée, rendant chaque pas potentiellement dangereux tout en devant maintenir la vitesse de fuite.',
        evalTips: 'Évaluer la répartition intelligente des poids, l\'agilité individuelle, et le déplacement furtif ou coordonné du collectif sur terrain instable.',
        attendu: 'Le shinobi apte adapte sa foulée et sa répartition de poids au terrain instable plutôt que de courir sans précaution, et aide les membres les plus en difficulté sans ralentir dangereusement l\'ensemble du groupe.'
    },
    {
        id: 'sc-66',
        category: 'Gestion de Crise',
        title: 'Passe montagneuse obstruée',
        desc: 'L\'unique chemin de retour connu vers Sunagakure se retrouve totalement bloqué par un éboulement massif de rochers suite à un séisme local, sans qu\'aucune carte ne mentionne d\'itinéraire alternatif fiable dans les environs immédiats.',
        evalTips: 'Mesurer la capacité à rechercher activement de nouvelles voies tactiques sans céder à la panique face à l\'imprévu géologique.',
        attendu: 'Une réponse adaptée engage une reconnaissance méthodique des alternatives (contournement, ascension partielle) plutôt qu\'un attentisme passif, en priorisant la sécurité de la progression sur la rapidité.'
    },
    {
        id: 'sc-67',
        category: 'Gestion de Crise',
        title: 'Coupure soudaine des réserves d\'oxygène',
        desc: 'Lors d\'une mission dans les catacombes souterraines anciennes, l\'air de la galerie où se trouve votre unité commence à se raréfier brusquement, probablement en raison d\'un effondrement partiel bloquant une aération naturelle plus loin dans le réseau.',
        evalTips: 'Analyser la gestion du rythme respiratoire sous début de panique d\'asphyxie et la clarté des décisions malgré l\'urgence physiologique.',
        attendu: 'Le shinobi apte ralentit immédiatement l\'effort physique du groupe pour économiser l\'oxygène disponible, organise un repli rapide mais contrôlé vers la sortie connue la plus proche, sans céder à une course désordonnée.'
    },
    {
        id: 'sc-68',
        category: 'Gestion de Crise',
        title: 'Attaque d\'illusionnistes du son',
        desc: 'Des voix ennemies déformées et amplifiées résonnent soudain de toutes les directions dans les dunes environnantes, brouillant complètement les repères sonores habituels de l\'unité et rendant impossible la localisation exacte de la menace réelle.',
        evalTips: 'Évaluer l\'ancrage réactif du shinobi et sa capacité à s\'appuyer sur des repères physiques réels plutôt que sur les stimuli déformés.',
        attendu: 'Une réponse adaptée s\'appuie sur des repères non auditifs (vibrations au sol, position du soleil, mémoire du terrain) plutôt que de réagir aux voix, et regroupe le collectif en formation serrée pour limiter la confusion.'
    },
    {
        id: 'sc-69',
        category: 'Gestion de Crise',
        title: 'Secours d\'un aéronef de transport abattu',
        desc: 'Un planeur de transport de Sunagakure vient de s\'écraser en territoire officiellement neutre, avec à son bord plusieurs officiels du village blessés, dans une zone où votre présence armée pourrait être interprétée comme une violation de souveraineté par les autorités locales.',
        evalTips: 'Observer l\'organisation d\'un périmètre de sécurité d\'urgence malgré la sensibilité diplomatique de la zone d\'intervention.',
        attendu: 'Le shinobi apte priorise le secours immédiat aux blessés tout en minimisant l\'empreinte visible de l\'intervention (discrétion, durée limitée) pour ne pas envenimer la situation diplomatique.'
    },
    {
        id: 'sc-70',
        category: 'Gestion de Crise',
        title: 'Rupture de la digue du réservoir d\'eau',
        desc: 'Le réservoir principal alimentant le village subit une fissure majeure et grandissante sous l\'effet d\'un jutsu adverse récent, menaçant de vider intégralement la réserve d\'eau vitale du village en quelques dizaines de minutes si rien n\'est fait.',
        evalTips: 'Évaluer l\'action d\'obstruction d\'urgence, notamment par des jutsus de terre ou de scellement disponibles, et la rapidité de mobilisation.',
        attendu: 'Une réponse adaptée agit immédiatement avec les moyens disponibles pour colmater ou ralentir la fuite, tout en donnant l\'alerte pour mobiliser un renfort spécialisé si la brèche dépasse ses propres capacités.'
    },
    {
        id: 'sc-71',
        category: 'Gestion de Crise',
        title: 'Peste du sable au camp avancé',
        desc: 'Une maladie épidémique à propagation rapide touche déjà environ trente pour cent des effectifs du poste frontière avancé, avec des symptômes s\'aggravant en quelques heures seulement et un risque de contamination de l\'ensemble du campement.',
        evalTips: 'Mesurer l\'application stricte et rapide des barrières sanitaires d\'isolement malgré la pression du manque de personnel.',
        attendu: 'Le shinobi apte instaure une zone d\'isolement claire pour les cas identifiés sans délai, même au prix d\'une réduction temporaire de l\'effectif opérationnel, plutôt que de prioriser la disponibilité des troupes sur la sécurité sanitaire.'
    },
    {
        id: 'sc-72',
        category: 'Gestion de Crise',
        title: 'Sabotage des marionnettes de défense',
        desc: 'Les automates de protection du village, normalement fidèles, se retournent soudainement contre la garnison suite à un virus de chakra introduit dans leur système de contrôle central, attaquant indifféremment amis et ennemis dans le périmètre.',
        evalTips: 'Analyser la capacité à couper d\'urgence les flux de chakra alimentant les automates et à procéder à une désactivation manuelle sécurisée.',
        attendu: 'Une réponse adaptée cherche en priorité le point de coupure du système plutôt que d\'engager un combat direct et coûteux contre chaque automate, tout en organisant un repli des non-combattants pendant l\'opération.'
    },
    {
        id: 'sc-73',
        category: 'Gestion de Crise',
        title: 'Attaque surprise pendant le bivouac',
        desc: 'Un assaut mené par une escouade volante ennemie surprend votre unité alors que la majorité des shinobis sont encore en tenue de repos, sans armure ni armes immédiatement accessibles, en pleine nuit de bivouac.',
        evalTips: 'Observer la rapidité d\'équipement sous stress et la capacité de rassemblement rapide sous couverture improvisée.',
        attendu: 'Le shinobi apte privilégie une mise à l\'abri immédiate suivie d\'un équipement minimal fonctionnel plutôt que de perdre un temps précieux à s\'équiper intégralement en terrain découvert et exposé.'
    },
    {
        id: 'sc-74',
        category: 'Gestion de Crise',
        title: 'Épuisement total du chakra',
        desc: 'Le médecin de votre équipe s\'effondre en syncope après avoir prodigué des soins continus sans interruption à plusieurs blessés graves durant des heures, laissant l\'unité sans expertise médicale au moment où d\'autres blessés pourraient encore survenir.',
        evalTips: 'Évaluer la mise en place d\'une rotation des soins et la protection anticipée du personnel médical, considéré comme une ressource vulnérable et précieuse.',
        attendu: 'Une réponse adaptée aurait normalement anticipé une rotation de repos avant l\'épuisement total, et face au fait accompli, organise un relais immédiat avec les compétences de premiers secours disponibles dans le reste de l\'unité.'
    },
    {
        id: 'sc-75',
        category: 'Gestion de Crise',
        title: 'Encerclement dans une ruine abandonnée',
        desc: 'Votre unité se retrouve piégée à l\'intérieur de ruines antiques, assiégée par une vingtaine de ninjas ennemis armés postés à chaque issue connue, avec des vivres et des munitions limités pour soutenir un siège prolongé.',
        evalTips: 'Mesurer la mise en place d\'une défense de siège cohérente et la préparation méthodique d\'une percée nocturne plutôt qu\'un attentisme passif.',
        attendu: 'Le shinobi apte organise une défense économe en ressources tout en préparant activement un plan de percée profitant de la baisse de vigilance nocturne de l\'ennemi, plutôt que d\'attendre passivement un secours incertain.'
    },

    // --------------------------------------------------------------------------
    // CATEGORIE 4 : NÉGOCIATION & INFILTRATION (76 à 100)
    // --------------------------------------------------------------------------
    {
        id: 'sc-76',
        category: 'Négociation & Infiltration',
        title: 'Gestion d\'un prisonnier ennemi',
        desc: 'Un ninja déserteur capturé propose de fournir des informations clés sur les positions ennemies en échange de la garantie que sa vie sera épargnée, alors même que le protocole militaire prévoit sa livraison sans condition à la garnison pour jugement.',
        evalTips: 'Évaluer le discernement éthique, la fermeté sans cruauté, et la gestion habile du renseignement obtenu sans promesse hors de portée.',
        attendu: 'Une réponse adaptée évite de promettre ce qui ne dépend pas de son autorité, tout en recueillant l\'information par une négociation honnête sur ce qu\'elle peut réellement influencer (traitement, transmission favorable au dossier).'
    },
    {
        id: 'sc-77',
        category: 'Négociation & Infiltration',
        title: 'Négociation avec un ennemi supérieur',
        desc: 'En situation de net désavantage numérique face à une force ennemie largement supérieure, le commandant adverse propose une trêve temporaire conditionnée à un échange de matériel tactique, une offre pouvant cacher un piège ou être sincèrement dans l\'intérêt des deux camps.',
        evalTips: 'Analyser le sang-froid affiché, la finesse diplomatique sous menace directe, et la protection prioritaire des secrets stratégiques du village.',
        attendu: 'Le shinobi apte négocie sans jamais céder d\'information ou de matériel sensible pour Suna, reste attentif aux signes de traîtrise potentielle, et privilégie un accord limité et vérifiable plutôt qu\'une confiance aveugle.'
    },
    {
        id: 'sc-78',
        category: 'Négociation & Infiltration',
        title: 'Interrogatoire sous pression stratégique',
        desc: 'Un officier adverse capturé refuse obstinément de parler alors qu\'un assaut nocturne majeur est prévu dans moins de deux heures et que ses informations pourraient sauver de nombreuses vies alliées si elles étaient obtenues à temps.',
        evalTips: 'Mesurer le respect des règles éthiques militaires même sous une forte urgence opérationnelle, sans dérive vers des méthodes prohibées.',
        attendu: 'Une réponse adaptée épuise les méthodes légitimes de pression psychologique et de négociation avant d\'envisager toute méthode extrême, et reste dans le cadre déontologique même si le temps presse fortement.'
    },
    {
        id: 'sc-79',
        category: 'Négociation & Infiltration',
        title: 'Protection des parchemins secrets',
        desc: 'Encerclée sans espoir d\'extraction immédiate, votre unité doit choisir entre brûler sur-le-champ des parchemins d\'État contenant des secrets stratégiques vitaux pour Suna, ou tenter de négocier une reddition qui pourrait préserver des vies mais laisser les documents tomber aux mains ennemies.',
        evalTips: 'Mesurer la priorité absolue accordée à la sécurité nationale de Suna face à la préservation immédiate de vies humaines.',
        attendu: 'Le shinobi apte priorise généralement la destruction des secrets stratégiques sur la négociation si le risque de capture des documents est réel et immédiat, tout en cherchant simultanément une option de survie pour l\'équipe.'
    },
    {
        id: 'sc-80',
        category: 'Négociation & Infiltration',
        title: 'Infiltration d\'un marché clandestin',
        desc: 'Vous devez vous fondre parmi des trafiquants armés dans un marché clandestin réputé dangereux afin d\'obtenir des pièces de rechange rares pour les marionnettes de combat de Suna, sous une fausse identité qui ne résisterait pas à un examen approfondi.',
        evalTips: 'Évaluer l\'adaptabilité comportementale, la crédibilité de la couverture adoptée, et le sang-froid maintenu sous fausse identité prolongée.',
        attendu: 'Une réponse adaptée maintient une posture cohérente et discrète tout au long de l\'interaction, évite les questions inutiles qui éveilleraient les soupçons, et prévoit un plan de sortie rapide en cas de découverte.'
    },
    {
        id: 'sc-81',
        category: 'Négociation & Infiltration',
        title: 'Déchiffrement d\'un code ennemi',
        desc: 'Vous interceptez un message crypté qui semble annoncer une embuscade imminente, mais poursuivre son déchiffrement complet sur place implique de rester dangereusement longtemps à portée d\'une tour de guet ennemie susceptible de repérer votre présence.',
        evalTips: 'Analyser l\'évaluation du ratio entre le gain d\'information espéré et le risque de détection encouru pour l\'obtenir.',
        attendu: 'Le shinobi apte évalue rapidement s\'il peut extraire l\'information essentielle sans tout déchiffrer sur place, privilégiant l\'emport du message pour analyse en sécurité plutôt qu\'une exposition prolongée non nécessaire.'
    },
    {
        id: 'sc-82',
        category: 'Négociation & Infiltration',
        title: 'Négociation d\'accès à un puits privé',
        desc: 'Le chef ombrageux d\'une tribu nomade refuse dans un premier temps de laisser votre patrouille assoiffée s\'approvisionner à son puits privé, méfiant envers les représentants de Suna suite à de mauvaises expériences passées avec d\'autres villages.',
        evalTips: 'Observer la diplomatie culturelle déployée et le respect sincère des coutumes tribales locales plutôt qu\'une posture de supériorité.',
        attendu: 'Une réponse adaptée prend le temps d\'un échange respectueux tenant compte des codes culturels locaux, sans jamais recourir à l\'intimidation, même sous la pression de la soif.'
    },
    {
        id: 'sc-83',
        category: 'Négociation & Infiltration',
        title: 'Double jeu lors d\'une fausse reddition',
        desc: 'Le plan tactique consiste à simuler une capitulation complète et convaincante pour approcher suffisamment près du poste de commandement adverse afin d\'en détruire discrètement le système radar, une opération exigeant un contrôle émotionnel total sous le regard méfiant de l\'ennemi.',
        evalTips: 'Évaluer la maîtrise des émotions trompeuses affichées et l\'exécution disciplinée du plan de ruse jusqu\'à son terme.',
        attendu: 'Le shinobi apte maintient la couverture avec constance même sous provocation ennemie, sans rupture de posture prématurée, et exécute l\'objectif de sabotage au moment opportun sans précipitation.'
    },
    {
        id: 'sc-84',
        category: 'Négociation & Infiltration',
        title: 'Passage clandestin d\'un poste de douane',
        desc: 'Deux agents de renseignement de Suna doivent franchir un poste de contrôle douanier récemment renforcé suite à des tensions frontalières, munis de faux documents dont la qualité n\'a pas été testée face à ce niveau accru de vigilance.',
        evalTips: 'Mesurer l\'assurance affichée, la préparation minutieuse des faux papiers, et la maîtrise du stress sous examen direct des gardes.',
        attendu: 'Une réponse adaptée prépare une histoire de couverture cohérente et répétée à l\'avance, reste naturelle sous l\'examen sans sur-jouer l\'assurance, et anticipe un plan B discret en cas de question inattendue.'
    },
    {
        id: 'sc-85',
        category: 'Négociation & Infiltration',
        title: 'Échange d\'otages au coucher du soleil',
        desc: 'L\'échange convenu d\'un diplomate de Suna contre un sous-officier ennemi capturé doit se dérouler en terrain totalement découvert, sans possibilité de couverture rapprochée, un contexte propice à une trahison de dernière minute de l\'un ou l\'autre camp.',
        evalTips: 'Observer le positionnement judicieux d\'éventuels tireurs de couverture et le respect scrupuleux de la parole donnée durant l\'échange.',
        attendu: 'Le shinobi apte sécurise en amont des points d\'observation discrets sans violer l\'accord de terrain découvert, exécute l\'échange sans geste précipité, et reste prêt à réagir sans provoquer d\'incident le premier.'
    },
    {
        id: 'sc-86',
        category: 'Négociation & Infiltration',
        title: 'Recrutement d\'un informateur local',
        desc: 'Un aubergiste local lourdement endetté auprès de créanciers peu scrupuleux pourrait fournir des détails précieux sur les passages de patrouilles étrangères, mais sa situation de vulnérabilité rend la frontière entre incitation légitime et exploitation abusive particulièrement mince.',
        evalTips: 'Analyser la finesse d\'incitation psychologique employée, sans recours à la menace de violence ni exploitation excessive de la détresse.',
        attendu: 'Une réponse adaptée propose une compensation honnête et proportionnée plutôt que d\'exploiter la dette comme un levier de pression coercitif, respectant la dignité de l\'informateur.'
    },
    {
        id: 'sc-87',
        category: 'Négociation & Infiltration',
        title: 'Sabotage d\'une tour de communication',
        desc: 'Vous devez placer une charge de scellement silencieuse sur le mât de transmission ennemi sans neutraliser les gardes postés à proximité, une opération d\'infiltration pure exigeant une discrétion absolue sur toute la durée de l\'approche et de la pose.',
        evalTips: 'Évaluer la discrétion d\'infiltration pure recherchée et la capacité à renoncer si les conditions de silence ne sont plus réunies.',
        attendu: 'Le shinobi apte privilégie l\'abandon temporaire de l\'opération plutôt qu\'un compromis bruyant si la discrétion est compromise, la priorité restant l\'objectif silencieux plutôt qu\'une réussite forcée à tout prix.'
    },
    {
        id: 'sc-88',
        category: 'Négociation & Infiltration',
        title: 'Subornation d\'un garde de prison',
        desc: 'Un mercenaire gardant la porte arrière du centre de détention semble sensible à une offre financière discrète, mais son comportement erratique laisse planer un doute sur sa fiabilité une fois le pot-de-vin accepté.',
        evalTips: 'Mesurer le sens de l\'opportunité et l\'estimation réaliste des motivations et de la fiabilité d\'autrui avant de s\'engager.',
        attendu: 'Une réponse adaptée teste la fiabilité du garde par une demande limitée avant de lui confier un rôle critique, plutôt que de miser l\'ensemble de l\'opération sur une confiance non vérifiée.'
    },
    {
        id: 'sc-89',
        category: 'Négociation & Infiltration',
        title: 'Neutralisation silencieuse au poison de sommeil',
        desc: 'L\'objectif est d\'endormir sans bruit les sentinelles du poste de guet en contaminant discrètement leur tisane du soir, une méthode non létale mais qui exige un dosage précis et un accès furtif difficile à la cuisine du poste.',
        evalTips: 'Observer la préférence marquée pour des méthodes non létales et propres lorsque la situation le permet, plutôt qu\'une élimination directe.',
        attendu: 'Le shinobi apte privilégie effectivement cette méthode non létale quand elle est réalisable en toute sécurité, tout en préparant un plan alternatif de combat si l\'accès discret échoue.'
    },
    {
        id: 'sc-90',
        category: 'Négociation & Infiltration',
        title: 'Vol de documents secrets dans le bureau du gouverneur',
        desc: 'Infiltré dans le palais de la ville frontière sous couverture de personnel de service, vous devez atteindre le bureau du gouverneur pour y dérober des documents sensibles, avec le risque constant d\'une confrontation imprévue dans les couloirs surveillés.',
        evalTips: 'Évaluer l\'improvisation rapide et crédible lors d\'une confrontation imprévue dans un couloir, sans rompre immédiatement la couverture.',
        attendu: 'Une réponse adaptée improvise une excuse plausible cohérente avec son rôle de couverture plutôt que de figer ou de fuir immédiatement, réservant la confrontation directe au tout dernier recours.'
    },
    {
        id: 'sc-91',
        category: 'Négociation & Infiltration',
        title: 'Désinformation d\'un espion infiltré',
        desc: 'Un agent ennemi infiltré dans les rangs de Suna a été identifié discrètement. Plutôt que de l\'arrêter immédiatement, l\'option envisagée est de lui laisser fuiter volontairement un faux plan d\'attaque afin de tromper durablement le camp adverse.',
        evalTips: 'Analyser le niveau de stratégie de contre-espionnage déployé et la patience nécessaire pour ne pas griller l\'opération prématurément.',
        attendu: 'Le shinobi apte comprend l\'intérêt à long terme de maintenir l\'espion actif sous surveillance plutôt qu\'une arrestation immédiate satisfaisante à court terme, et prépare soigneusement le faux plan pour qu\'il résiste à un examen ennemi.'
    },
    {
        id: 'sc-92',
        category: 'Négociation & Infiltration',
        title: 'Extraction d\'un scientifique déserteur',
        desc: 'Un ingénieur spécialisé en marionnettes de combat, souhaitant fuir son pays d\'origine pour rejoindre Suna, doit être exfiltré discrètement sous escorte, sa vulnérabilité physique et son inexpérience du terrain compliquant nettement l\'opération.',
        evalTips: 'Observer la protection accordée à une cible civile vulnérable lors d\'une opération de fuite exigeant discrétion et rapidité.',
        attendu: 'Une réponse adaptée adapte le rythme et l\'itinéraire d\'exfiltration aux capacités réelles du civil protégé plutôt qu\'à un rythme purement militaire, en restant vigilant sur sa sécurité tout au long du trajet.'
    },
    {
        id: 'sc-93',
        category: 'Négociation & Infiltration',
        title: 'Négociation de trêve d\'urgence sanitaire',
        desc: 'De nombreux blessés des deux camps gisent sur le champ de bataille après un affrontement récent. Obtenir une pause des tirs de quatre heures permettrait de les évacuer, mais suppose de convaincre un commandement ennemi qui n\'a aucune obligation formelle d\'accepter.',
        evalTips: 'Évaluer l\'autorité morale déployée et la capacité de conviction diplomatique face à un interlocuteur sans obligation de coopérer.',
        attendu: 'Le shinobi apte construit un argumentaire d\'intérêt mutuel (leurs propres blessés aussi bénéficient de la trêve) plutôt qu\'un simple appel à l\'humanité, augmentant les chances réelles d\'acceptation.'
    },
    {
        id: 'sc-94',
        category: 'Négociation & Infiltration',
        title: 'Identification d\'un leurre magique',
        desc: 'Trois convois identiques traversent simultanément le désert, mais deux d\'entre eux ne sont que des illusions destinées à protéger la véritable caravane stratégique. Le temps pour identifier le bon convoi avant qu\'il ne s\'éloigne définitivement est très limité.',
        evalTips: 'Mesurer le sens de l\'observation analytique fine et la capacité de détection de chakra pour distinguer le réel de l\'illusoire.',
        attendu: 'Une réponse adaptée s\'appuie sur des indices méthodiques (signature de chakra, détails physiques incohérents) plutôt qu\'une intuition seule, et accepte de prendre le temps nécessaire plutôt que de se précipiter sur un choix au hasard.'
    },
    {
        id: 'sc-95',
        category: 'Négociation & Infiltration',
        title: 'Création d\'une fausse piste dans les dunes',
        desc: 'Pour semer une patrouille de poursuite qui se rapproche dangereusement, l\'unité doit disperser des empreintes et du matériel usagé de façon crédible afin de diriger les poursuivants vers une impasse, sans éveiller leurs soupçons par une piste trop artificielle.',
        evalTips: 'Observer la créativité déployée dans l\'art de l\'évasion et la crédibilité du leurre mis en place sous contrainte de temps.',
        attendu: 'Le shinobi apte construit un leurre cohérent avec le comportement attendu d\'un groupe en fuite réelle, en évitant les détails trop parfaits qui trahiraient une mise en scène.'
    },
    {
        id: 'sc-96',
        category: 'Négociation & Infiltration',
        title: 'Négociation de rachat de matériel confisqué',
        desc: 'Un rouleau de scellement appartenant à Suna a été confisqué par des miliciens locaux indépendants revendiquant un droit de contrôle sur leur territoire. Le racheter est envisageable, mais toute maladresse pourrait déclencher un conflit ouvert non souhaité par le village.',
        evalTips: 'Analyser la gestion simultanée des intérêts financiers et des enjeux diplomatiques plus larges liés à l\'incident.',
        attendu: 'Une réponse adaptée privilégie une négociation mesurée respectant l\'autorité locale revendiquée, plutôt qu\'une posture de force qui envenimerait inutilement la relation avec la milice.'
    },
    {
        id: 'sc-97',
        category: 'Négociation & Infiltration',
        title: 'Infiltration par le réseau d\'égouts et d\'aqueducs',
        desc: 'La seule voie d\'accès discrète à la forteresse en ruine repérée passe par un ancien réseau de conduits d\'eau asséchés, étroits, insalubres et propices à des accès de claustrophobie chez certains membres de l\'unité peu habitués à ce type d\'environnement.',
        evalTips: 'Évaluer la tolérance individuelle aux environnements insalubres et confinés, et la gestion d\'éventuels signes de claustrophobie chez soi ou un coéquipier.',
        attendu: 'Le shinobi apte gère son propre inconfort sans qu\'il n\'affecte sa progression, et reste attentif aux signes de détresse chez un coéquipier pour adapter le rythme sans compromettre la discrétion de l\'infiltration.'
    },
    {
        id: 'sc-98',
        category: 'Négociation & Infiltration',
        title: 'Apaisement d\'une émeute locale',
        desc: 'Une foule de villageois en colère se rassemble pour protester bruyamment contre la réquisition temporaire de nourriture décidée par le commandement local, la situation menaçant de dégénérer en affrontement si aucune désescalade n\'intervient rapidement.',
        evalTips: 'Mesurer la communication publique pacifiante déployée et la capacité de désescalade sans recours à la force face à des civils.',
        attendu: 'Une réponse adaptée engage un dialogue public calme reconnaissant la légitimité de la frustration villageoise, propose une explication ou une compensation concrète, plutôt que d\'imposer le silence par la force.'
    },
    {
        id: 'sc-99',
        category: 'Négociation & Infiltration',
        title: 'Paiement d\'un droit de passage à un pont',
        desc: 'Un garde manifestement corrompu exige une taxe de passage prohibitive et non officielle pour laisser franchir l\'escouade sur le seul pont praticable de la région, une situation d\'extorsion déguisée en formalité administrative locale.',
        evalTips: 'Observer la négociation ferme de marchandage employée pour éviter de se faire extorquer sans pour autant provoquer un incident inutile.',
        attendu: 'Le shinobi apte négocie fermement à la baisse en gardant son calme, sans céder immédiatement au tarif exigé ni escalader vers la confrontation pour une somme qui reste gérable.'
    },
    {
        id: 'sc-100',
        category: 'Négociation & Infiltration',
        title: 'Exfiltration d\'urgence sous couverture diplomatique',
        desc: 'Pour quitter discrètement un territoire ennemi devenu trop dangereux, votre escouade doit s\'intégrer temporairement au convoi officiel d\'un ambassadeur d\'un pays tiers, une manœuvre délicate exigeant de maintenir une couverture crédible jusqu\'au franchissement complet de la frontière.',
        evalTips: 'Évaluer la finesse stratégique globale et la maîtrise accomplie des opérations d\'infiltration prolongées sous couverture complexe.',
        attendu: 'Une réponse adaptée maintient une posture cohérente et discrète tout au long du convoi, anticipe les questions protocolaires possibles, et ne relâche la vigilance qu\'une fois la frontière effectivement franchie en sécurité.'
    }
];
