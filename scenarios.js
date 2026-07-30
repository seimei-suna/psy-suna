/* ==========================================================================
   SEIMEI - SUNA: BANQUE COMPLÈTE DE 100 SCÉNARIOS CLINIQUE & COMBAT
   ========================================================================== */

const FULL_100_SCENARIOS_BANK = [
    // --------------------------------------------------------------------------
    // CATEGORIE 1 : DILEMME MORAL (1 à 25)
    // --------------------------------------------------------------------------
    {
        id: 'sc-1',
        category: 'Dilemme Moral',
        title: 'Priorité à un civil en danger',
        desc: 'Au cours d\'une mission de reconnaissance prioritaire, l\'escouade repère un civil blessé attaqué par des mercenaires. Intervenir risque de compromettre la discrétion de l\'opération.',
        evalTips: 'Observer le délai d\'hésitation, le sens de l\'empathie vs la priorité tactique, et l\'argumentation de la décision.'
    },
    {
        id: 'sc-2',
        category: 'Dilemme Moral',
        title: 'Sauver un allié ou terminer l\'objectif',
        desc: 'Un coéquipier est piégé sous les décombres lors d\'une fuite. Le temps presse pour livrer les documents stratégiques avant le coucher du soleil.',
        evalTips: 'Évaluer la pondération de la vie humaine vs l\'objectif militaire institutionnel.'
    },
    {
        id: 'sc-3',
        category: 'Dilemme Moral',
        title: 'Désobéir pour sauver une vie',
        desc: 'Le protocole exige l\'exécution immédiate de la retraite. Le shinobi aperçoit un camarade inconscient à 50 mètres de la ligne ennemie.',
        evalTips: 'Évaluer la prise de risque personnelle, le respect du serment et la justification du choix.'
    },
    {
        id: 'sc-4',
        category: 'Dilemme Moral',
        title: 'Survie personnelle ou réussite de mission',
        desc: 'Seule la destruction du pont assurera le blocus, mais le shinobi déclenchant l\'amorce aura peu de chances d\'extraire vivant.',
        evalTips: 'Mesurer la résilience extrême, l\'altruisme patriotique vs l\'instinct de conservation.'
    },
    {
        id: 'sc-5',
        category: 'Dilemme Moral',
        title: 'Le convoi médical d\'urgence',
        desc: 'L\'escouade escorte un sérum antipoison vital pour la garnison. En chemin, un village voisin signale une attaque de brigands sans défense.',
        evalTips: 'Évaluer la capacité à hiérarchiser les urgences absolues vs l\'impératif de secours immédiat.'
    },
    {
        id: 'sc-6',
        category: 'Dilemme Moral',
        title: 'Sacrifice d\'équipement légendaire',
        desc: 'Pour ralentir une troupe de poursuite ennemie, le shinobi doit abandonner ou détruire des marionnettes rares léguées par le village.',
        evalTips: 'Évaluer le détachement matériel au profit de la survie collective et de la réussite stratégique.'
    },
    {
        id: 'sc-7',
        category: 'Dilemme Moral',
        title: 'Recours au Jutsu à contrecoup',
        desc: 'L\'avant-poste est sur le point d\'être submergé. Le shinobi peut utiliser une technique interdite qui épuisera durablement sa santé.',
        evalTips: 'Observer la capacité d\'abnégation et le sens du sacrifice mesuré.'
    },
    {
        id: 'sc-8',
        category: 'Dilemme Moral',
        title: 'Le choix du messager',
        desc: 'Un seul messager peut s\'échapper pour prévenir le village. Deux membres de l\'équipe se proposent, l\'un est plus rapide, l\'autre est blessé.',
        evalTips: 'Observer la lucidité tactique non biaisée par l\'affectation personnelle.'
    },
    {
        id: 'sc-9',
        category: 'Dilemme Moral',
        title: 'Partage des rations d\'eau en zone aride',
        desc: 'La réserve d\'eau est insuffisante pour atteindre la prochaine oasis. Le shinobi doit décider de l\'attribution des dernières gourdes.',
        evalTips: 'Mesurer la capacité de justice distributive et l\'altruisme sous détresse physique.'
    },
    {
        id: 'sc-10',
        category: 'Dilemme Moral',
        title: 'Évacuation des civils blessés',
        desc: 'L\'escouade escorte des villageois. Les traînards ralentissent la marche et mettent en péril le groupe face à la tempête imminente.',
        evalTips: 'Évaluer le sens du devoir humanitaire sous contrainte temporelle extrême.'
    },
    {
        id: 'sc-11',
        category: 'Dilemme Moral',
        title: 'Neutralisation d\'un ancien camarade déserteur',
        desc: 'Un déserteur local informe sur des patrouilles alliées. Il s\'agit d\'un ami d\'enfance de l\'académie.',
        evalTips: 'Observer le détachement émotionnel et l\'impartialité institutionnelle.'
    },
    {
        id: 'sc-12',
        category: 'Dilemme Moral',
        title: 'Utilisation d\'une source d\'eau polluée',
        desc: 'Consommer une eau potentiellement empoisonnée pour survivre 24h ou risquer le choc d\'inconscience thermique.',
        evalTips: 'Analyser la gestion des risques physiologiques et le pragmatisme survie.'
    },
    {
        id: 'sc-13',
        category: 'Dilemme Moral',
        title: 'Livraison de prisonniers de guerre',
        desc: 'Des prisonniers ennemis affaiblis demandent à être relâchés dans le désert au lieu d\'être transférés au centre de détention.',
        evalTips: 'Évaluer la déontologie militaire et l\'absence de vengeance personnelle.'
    },
    {
        id: 'sc-14',
        category: 'Dilemme Moral',
        title: 'Destruction d\'un pont d\'approvisionnement civil',
        desc: 'Faire sauter un pont reliant un village à ses terres pour couper l\'approvisionnement ennemie.',
        evalTips: 'Mesurer la capacité à assumer les dommages collatéraux stratégiques.'
    },
    {
        id: 'sc-15',
        category: 'Dilemme Moral',
        title: 'Révélation d\'une erreur de commandement',
        desc: 'Une erreur tactique du capitaine a causé des pertes. Le rapport officiel peut couvrir l\'erreur ou dire la vérité au conseil.',
        evalTips: 'Évaluer l\'honnêteté intellectuelle et l\'intégrité envers l\'institution.'
    },
    {
        id: 'sc-16',
        category: 'Dilemme Moral',
        title: 'Protection d\'une relique culturelle',
        desc: 'Protéger un parchemin sacré de Sunagakure ou utiliser le temps imparti pour sécuriser une patrouille de jeunes genins.',
        evalTips: 'Pondération de la valeur symbolique/historique vs la vie humaine.'
    },
    {
        id: 'sc-17',
        category: 'Dilemme Moral',
        title: 'Attaque préventive sur un camp indécis',
        desc: 'Attaquer un groupe armé non identifié approchant de la frontière avant qu\'il n\'initie le premier tir.',
        evalTips: 'Évaluer la doctrine de légitime défense vs l\'impulsivité préventive.'
    },
    {
        id: 'sc-18',
        category: 'Dilemme Moral',
        title: 'Soigner un ennemi agonisant',
        desc: 'Un ninja adverse mourant détient une carte. Utiliser les rares soins pour le maintenir éveillé ou sauver un coéquipier.',
        evalTips: 'Analyser la gestion des ressources médicales d\'urgence et la priorité alliée.'
    },
    {
        id: 'sc-19',
        category: 'Dilemme Moral',
        title: 'Sabotage d\'une oasis occupée',
        desc: 'Empoisonner temporairement une source d\'eau pour forcer le retrait de la garnison ennemie installée.',
        evalTips: 'Évaluer la limite des tactiques de guerre non conventionnelles.'
    },
    {
        id: 'sc-20',
        category: 'Dilemme Moral',
        title: 'Refus de l\'euthanasie de combat',
        desc: 'Un coéquipier grièvement blessé supplie d\'être achevé pour ne pas ralentir le groupe.',
        evalTips: 'Observer la résistance à la pression morale et la recherche de solutions de sauvetage alternative.'
    },
    {
        id: 'sc-21',
        category: 'Dilemme Moral',
        title: 'Vol de provisions d\'un marchand itinérant',
        desc: 'L\'unité est déshydratée et aperçoit une caravane marchande privée sans escorte.',
        evalTips: 'Évaluer le respect du droit des civils face au besoin biologique urgent.'
    },
    {
        id: 'sc-22',
        category: 'Dilemme Moral',
        title: 'Rapport sur la faiblesse psychologique d\'un équipier',
        desc: 'Signaler la crise de panique d\'un camarade lors du dernier assaut, risquant sa rétrogradation.',
        evalTips: 'Observer la loyauté envers l\'équipe vs la sécurité des futures missions.'
    },
    {
        id: 'sc-23',
        category: 'Dilemme Moral',
        title: 'Choix de l\'itinéraire de repli',
        desc: 'Passer par la passe montagneuse dangereuse ou contourner par la vallée sous tir de sniper.',
        evalTips: 'Analyser l\'acceptation du risque environnemental vs le risque humain armé.'
    },
    {
        id: 'sc-24',
        category: 'Dilemme Moral',
        title: 'Embauche d\'un guide douteux',
        desc: 'Payer un contrebandier local recherché par Suna pour sortir d\'un champ de mines de sable.',
        evalTips: 'Évaluer le pragmatisme tactique sous contrainte vitale.'
    },
    {
        id: 'sc-25',
        category: 'Dilemme Moral',
        title: 'Se rendre pour sauver son équipe',
        desc: 'Offrir sa capture personnelle au commandant adverse en échange de la libération des 3 genins encerclés.',
        evalTips: 'Mesurer le sens ultime de la responsabilité de commandement.'
    },

    // --------------------------------------------------------------------------
    // CATEGORIE 2 : COMMANDEMENT & DISCIPLINE (26 à 50)
    // --------------------------------------------------------------------------
    {
        id: 'sc-26',
        category: 'Commandement & Discipline',
        title: 'Recevoir un ordre contestable',
        desc: 'Un supérieur ordonne d\'abandonner une zone de refuge civile pour maintenir la vitesse de marche. L\'ordre est légal mais moralement discutable.',
        evalTips: 'Analyser la capacité d\'obéissance réfléchie, le respect de la hiérarchie et les formes de contestation.'
    },
    {
        id: 'sc-27',
        category: 'Commandement & Discipline',
        title: 'Conflit avec un supérieur',
        desc: 'Un conflit stratégique majeur éclate entre deux responsables lors d\'un briefing de combat chaud. Le shinobi doit positionner sa loyauté.',
        evalTips: 'Observer le tact professionnel, l\'évitement des biais personnels et le recentrage sur l\'intérêt de Suna.'
    },
    {
        id: 'sc-28',
        category: 'Commandement & Discipline',
        title: 'Conflit de juridiction au poste frontière',
        desc: 'Une patrouille d\'un village allié refuse l\'accès à une oasis sous prétexte de soupçons d\'espionnage. L\'escouade a besoin d\'eau de toute urgence.',
        evalTips: 'Observer la retenue diplomatique, le contrôle de la colère et l\'art de la négociation.'
    },
    {
        id: 'sc-29',
        category: 'Commandement & Discipline',
        title: 'Ordre de retraite précipitée',
        desc: 'L\'état-major ordonne un repli immédiat, abandonnant le matériel lourd et les provisions de secours sur le terrain.',
        evalTips: 'Mesurer l\'obéissance immédiate aux ordres de haut niveau sans contestation stérile.'
    },
    {
        id: 'sc-30',
        category: 'Commandement & Discipline',
        title: 'Querelle d\'ego au sein de l\'escouade',
        desc: 'Deux shinobis de même rang refusent de collaborer sur la mise en place d\'un piège tactique en raison d\'un différend passé.',
        evalTips: 'Observer les qualités de médiation, de fermeté et de maintien de l\'esprit d\'équipe.'
    },
    {
        id: 'sc-31',
        category: 'Commandement & Discipline',
        title: 'Gestion d\'un acte d\'insubordination mineur',
        desc: 'Un genin refuse d\'effectuer la garde de nuit en raison d\'une fatigue extrême avancée.',
        evalTips: 'Évaluer la fermeté disciplinaire tempérée par la prise en compte de l\'état physique.'
    },
    {
        id: 'sc-32',
        category: 'Commandement & Discipline',
        title: 'Désignation du chef d\'escouade par intérim',
        desc: 'Le chef est hors de combat. Deux membres revendiquent la direction des opérations.',
        evalTips: 'Observer la capacité à s\'imposer par le calme et la légitimité tactique.'
    },
    {
        id: 'sc-33',
        category: 'Commandement & Discipline',
        title: 'Respect du couvre-feu au campement',
        desc: 'Des shinobis allument un feu de camp non autorisé risquant d\'attirer les patrouilles ennemies.',
        evalTips: 'Mesurer la réactivité de rappel à l\'ordre pour la sécurité collective.'
    },
    {
        id: 'sc-34',
        category: 'Commandement & Discipline',
        title: 'Sanction d\'une faute collective',
        desc: 'L\'ensemble de la patrouille a omis de vérifier l\'étanchéité des parchemins de réserve.',
        evalTips: 'Évaluer le sens de la responsabilité partagée et la pédagogie du commandement.'
    },
    {
        id: 'sc-35',
        category: 'Commandement & Discipline',
        title: 'Exécution d\'une consigne d\'urgence ambiguë',
        desc: 'Le message reçu par pigeon voyageur contient une faute de frappe critique sur la position de ralliement.',
        evalTips: 'Analyser l\'esprit d\'initiative sous ambiguïté des ordres reçus.'
    },
    {
        id: 'sc-36',
        category: 'Commandement & Discipline',
        title: 'Gestion des retards d\'entraînement',
        desc: 'Un shinobi s\'absente régulièrement des exercices tactiques de groupe sans motif médical.',
        evalTips: 'Observer l\'approche d\'entretien individuel et le recadrage professionnel.'
    },
    {
        id: 'sc-37',
        category: 'Commandement & Discipline',
        title: 'Contestation d\'une affectation de poste',
        desc: 'Un spécialiste des attaques à distance est affecté à la garde statique de la porte Sud.',
        evalTips: 'Pondérer l\'acceptation de la tâche assignée vs la suggestion d\'optimisation.'
    },
    {
        id: 'sc-38',
        category: 'Commandement & Discipline',
        title: 'Rapport sur une violation de protocole',
        desc: 'Un sous-officier a partagé la fréquence radio confidentielle avec des mercenaires locaux.',
        evalTips: 'Évaluer la rigueur sur la sécurité des communications stratégiques.'
    },
    {
        id: 'sc-39',
        category: 'Commandement & Discipline',
        title: 'Gestion du manque de respect hiérarchique',
        desc: 'Un genin talentueux remet en cause ouvertement les compétences d\'un vétéran lors du briefing.',
        evalTips: 'Mesurer la gestion du respect des aînés et de la cohésion d\'unité.'
    },
    {
        id: 'sc-40',
        category: 'Commandement & Discipline',
        title: 'Ordre de destruction de matériel allié',
        desc: 'Détruire les tourelles de défense automatiques du poste Ouest avant la prise par l\'adversaire.',
        evalTips: 'Évaluer l\'exécution froide des ordres de terre brûlée.'
    },
    {
        id: 'sc-41',
        category: 'Commandement & Discipline',
        title: 'Maintien de la discipline en captivité',
        desc: 'Prisonniers dans un camp ennemi, maintenir le moral et l\'ordre intérieur des troupes de Suna.',
        evalTips: 'Observer la résilience de commandement dans des conditions de privation absolue.'
    },
    {
        id: 'sc-42',
        category: 'Commandement & Discipline',
        title: 'Intégration d\'une recrue indisciplinée',
        desc: 'Accueillir au sein de l\'escouade un shinobi réputé ingérable mais doté d\'un jutsu exceptionnel.',
        evalTips: 'Évaluer les qualités d\'intégration et d\'encadrement de talents complexes.'
    },
    {
        id: 'sc-43',
        category: 'Commandement & Discipline',
        title: 'Gestion du sommeil lors des gardes croisées',
        desc: 'Organiser les tours de garde alors que 50% de l\'effectif souffre d\'insomnie liée au stress.',
        evalTips: 'Analyser la capacité de gestion logistique et de vigilance physique de l\'unité.'
    },
    {
        id: 'sc-44',
        category: 'Commandement & Discipline',
        title: 'Recadrage d\'un excès de zèle',
        desc: 'Un shinobi a poursuivi un ennemi en fuite hors du périmètre attribué au péril de l\'équipe.',
        evalTips: 'Observer la capacité à canaliser l\'agressivité tactique vers la discipline collective.'
    },
    {
        id: 'sc-45',
        category: 'Commandement & Discipline',
        title: 'Gestion des rumeurs de défaite au camp',
        desc: 'Des rumeurs d\'encerclement du village central circulent parmi les troupes de soutien.',
        evalTips: 'Mesurer la communication rassurante et la lutte contre la désinformation destabilisante.'
    },
    {
        id: 'sc-46',
        category: 'Commandement & Discipline',
        title: 'Validation des rapports de patrouille',
        desc: 'Détecter les incohérences temporelles dans le carnet de bord remis par l\'escouade Alpha.',
        evalTips: 'Évaluer le sens de la vérification rigoureuse des données transmises.'
    },
    {
        id: 'sc-47',
        category: 'Commandement & Discipline',
        title: 'Arbitrage sur la répartition du matériel médical',
        desc: 'Répartir 2 kits de premiers soins entre 4 sections opérant en zone à haut risque.',
        evalTips: 'Analyser la rationalisation stratégique des ressources d\'urgence.'
    },
    {
        id: 'sc-48',
        category: 'Commandement & Discipline',
        title: 'Gestion de la panique lors d\'une alerte chimique',
        desc: 'Une fausse alerte aux gaz toxiques déclenche un mouvement de foule dans la garnison.',
        evalTips: 'Observer la fermeté vocale et la prise de contrôle rapide du chaos.'
    },
    {
        id: 'sc-49',
        category: 'Commandement & Discipline',
        title: 'Transmission du commandement sur le champ de bataille',
        desc: 'Passer la main au second officier sous le feu direct des mortiers de sable.',
        evalTips: 'Évaluer la clarté des transmissions de consignes sous stress aigu.'
    },
    {
        id: 'sc-50',
        category: 'Commandement & Discipline',
        title: 'Contrôle des armes de grande puissance',
        desc: 'Interdire l\'utilisation d\'un rouleau de scellement lourd à proximité des réserves de carburant.',
        evalTips: 'Mesurer le respect strict des mesures de sécurité incendie/explosion.'
    },

    // --------------------------------------------------------------------------
    // CATEGORIE 3 : GESTION DE CRISE & SURVIE (51 à 75)
    // --------------------------------------------------------------------------
    {
        id: 'sc-51',
        category: 'Gestion de Crise',
        title: 'Réagir à la perte d\'un équipier',
        desc: 'Après l\'élimination brutale du capitaine d\'escouade, l\'unité se retrouve encerclée sans instructions. Panique ou prise en main de l\'unité ?',
        evalTips: 'Observer la capacité d\'initiative, la régulation émotionnelle sous choc traumatique et la prise de leadership.'
    },
    {
        id: 'sc-52',
        category: 'Gestion de Crise',
        title: 'Mission compromise et fuite',
        desc: 'L\'infiltration a échoué. Le shinobi doit choisir l\'itinéraire d\'évacuation entre la zone désertique risquée et la traversée d\'un village hôte.',
        evalTips: 'Observer l\'évaluation des risques collatéraux et l\'improvisation en terrain hostiles.'
    },
    {
        id: 'sc-53',
        category: 'Gestion de Crise',
        title: 'Piège dans la tempête de sable',
        desc: 'L\'unité est bloquée dans une tempête de sable à visibilité zéro. Des signaux de détresse inconnus retentissent à proximité.',
        evalTips: 'Analyser la vigilance tactique, le sang-froid en milieu hostile et la gestion des pièges d\'embuscade.'
    },
    {
        id: 'sc-54',
        category: 'Gestion de Crise',
        title: 'Soupçon de poison ou contamination',
        desc: 'Un coéquipier commence à manifester des signes de démence légère ou de poison lent au milieu du désert.',
        evalTips: 'Observer la réactivité médicale, la mise en quarantaine sécurisée et la protection du moral de l\'équipe.'
    },
    {
        id: 'sc-55',
        category: 'Gestion de Crise',
        title: 'Rupture totale des liaisons radio',
        desc: 'Toutes les communications avec Sunagakure sont coupées lors de l\'observation d\'un mouvement de troupes suspect.',
        evalTips: 'Évaluer l\'autonomie décisionnelle et le respect de la doctrine militaire en aveugle.'
    },
    {
        id: 'sc-56',
        category: 'Gestion de Crise',
        title: 'Capture de l\'officier supérieur',
        desc: 'Le capitaine d\'escouade est capturé vivant par des ninjas déserteurs qui réclament une rançon sous 2 heures.',
        evalTips: 'Évaluer l\'analyse tactique de sauvetage et la prise d\'initiative en situation d\'urgence extrême.'
    },
    {
        id: 'sc-57',
        category: 'Gestion de Crise',
        title: 'Marche forcé sous chaleur extrême',
        desc: 'L\'unité doit effectuer 48 heures de marche ininterrompue sous 45°C avec rationnement d\'eau critique.',
        evalTips: 'Observer la résilience physique/mentale et l\'entraide face à l\'épuisement.'
    },
    {
        id: 'sc-58',
        category: 'Gestion de Crise',
        title: 'Attaque nocturne par marionnettes sauvages',
        desc: 'Des automates autonomes non identifiés s\'infiltrent dans le campement à 3 heures du matin.',
        evalTips: 'Évaluer la vitesse de réveil opérationnel et l\'organisation de la défense circulaire.'
    },
    {
        id: 'sc-59',
        category: 'Gestion de Crise',
        title: 'Éboulement dans la mine de chakra',
        desc: 'Deux mineurs sont coincés dans une galerie instable menaçant de s\'effondrer complètement.',
        evalTips: 'Analyser le sang-froid lors de secours en environnement confiné périlleux.'
    },
    {
        id: 'sc-60',
        category: 'Gestion de Crise',
        title: 'Incendie au dépôt d\'explosifs',
        desc: 'Un feu se déclare à 10 mètres des rouleaux de scellement explosifs de la garnison.',
        evalTips: 'Observer la vitesse de réaction et le choix des priorités d\'extinction/évacuation.'
    },
    {
        id: 'sc-61',
        category: 'Gestion de Crise',
        title: 'Attaque de scorpion géant du désert',
        desc: 'Une créature du désert s\'attaque aux réserves de nourriture au milieu d\'un canyon étroit.',
        evalTips: 'Évaluer l\'adaptation du combat face aux faunes hostiles indigènes.'
    },
    {
        id: 'sc-62',
        category: 'Gestion de Crise',
        title: 'Infiltration de serpents venimeux',
        desc: 'Des serpents venimeux attirés par le chakra s\'infiltrent dans les sacs de couchage de l\'escouade.',
        evalTips: 'Mesurer le calme sans geste brusque et la maîtrise des réflexes sous peur.'
    },
    {
        id: 'sc-63',
        category: 'Gestion de Crise',
        title: 'Découverte d\'un champ de mines de sable',
        desc: 'La première ligne de la patrouille vient de déclencher une détonation sous ses pieds.',
        evalTips: 'Analyser l\'arrêt immédiat de la marche, le balisage sécurisé et le secours des blessés.'
    },
    {
        id: 'sc-64',
        category: 'Gestion de Crise',
        title: 'Hallucinations dues à la déshydratation',
        desc: 'Deux shinobis commencent à percevoir des oasis imaginaires et s\'éloignent du groupe.',
        evalTips: 'Observer la prise en charge médicale psychologique des délires thermiques.'
    },
    {
        id: 'sc-65',
        category: 'Gestion de Crise',
        title: 'Fuite à travers une mer de dunes mouvantes',
        desc: 'Traverser un sol instable s\'effondrant sous le poids tout en essuyant des tirs de flèches.',
        evalTips: 'Évaluer la répartition des poids, l\'agilité et le déplacement furtif collectif.'
    },
    {
        id: 'sc-66',
        category: 'Gestion de Crise',
        title: 'Passe montagneuse obstruée',
        desc: 'L\'unique chemin de retour est bloqué par une avalanche de rochers suite à un séisme.',
        evalTips: 'Mesurer la capacité à rechercher de nouvelles voies tactiques sans panique.'
    },
    {
        id: 'sc-67',
        category: 'Gestion de Crise',
        title: 'Coupure soudaine des réserves d\'oxygène',
        desc: 'Lors d\'une mission souterraine dans les catacombes, l\'air commence à se raréfier brusquement.',
        evalTips: 'Analyser la gestion du rythme respiratoire sous panique d\'asphyxie.'
    },
    {
        id: 'sc-68',
        category: 'Gestion de Crise',
        title: 'Attaque d\'illusionnistes du son',
        desc: 'Des voix ennemies déformées résonnent à 360° dans les dunes pour désorienter l\'unité.',
        evalTips: 'Évaluer l\'ancrage réactif et l\'utilisation des repères physiques réels.'
    },
    {
        id: 'sc-69',
        category: 'Gestion de Crise',
        title: 'Secours d\'un hélicoptère/aéronef de transport abattu',
        desc: 'Un planeur de Suna s\'est écrasé en territoire neutre avec des officiels à bord.',
        evalTips: 'Observer l\'organisation du périmètre de sécurité d\'urgence.'
    },
    {
        id: 'sc-70',
        category: 'Gestion de Crise',
        title: 'Rupture de la digue du réservoir d\'eau',
        desc: 'Le réservoir principal du village subit une fissure majeure sous l\'effet d\'un jutsu adverse.',
        evalTips: 'Évaluer l\'action d\'obstruction d\'urgence au moyen de jutsus de terre ou de scellement.'
    },
    {
        id: 'sc-71',
        category: 'Gestion de Crise',
        title: 'Peste du sable au camp avancé',
        desc: 'Une maladie épidémique foudroyante touche 30% des effectifs du poste frontière.',
        evalTips: 'Mesurer l\'application stricte des barrières sanitaires d\'isolement.'
    },
    {
        id: 'sc-72',
        category: 'Gestion de Crise',
        title: 'Sabotage des marionnettes de défense',
        desc: 'Les automates de protection se retournent contre la garnison suite à un virus de chakra.',
        evalTips: 'Analyser la coupure d\'urgence des flux de chakra et la désactivation manuelle.'
    },
    {
        id: 'sc-73',
        category: 'Gestion de Crise',
        title: 'Attaque surprise pendant le bivouac',
        desc: 'Assaut d\'escouade volante alors que les shinobis sont en tenue de repos.',
        evalTips: 'Observer la rapidité d\'équipement et le rassemblement sous couverture.'
    },
    {
        id: 'sc-74',
        category: 'Gestion de Crise',
        title: 'Épuisement total du chakra',
        desc: 'Le médecin de l\'équipe tombe en syncope suite à des soins continus prodigués aux blessés.',
        evalTips: 'Évaluer la rotation des soins et la protection du personnel médical vulnérable.'
    },
    {
        id: 'sc-75',
        category: 'Gestion de Crise',
        title: 'Encerclement dans une ruine abandonnée',
        desc: 'L\'unité est coincée dans des ruines antiques assiégées par 20 ninjas armés.',
        evalTips: 'Mesurer la défense de siège et la préparation d\'une percée nocturne.'
    },

    // --------------------------------------------------------------------------
    // CATEGORIE 4 : NÉGOCIATION & INFILTRATION (76 à 100)
    // --------------------------------------------------------------------------
    {
        id: 'sc-76',
        category: 'Négociation & Infiltration',
        title: 'Gestion d\'un prisonnier ennemi',
        desc: 'Un ninja déserteur ennemi fournit des informations clés mais supplie pour avoir la vie sauve avant d\'être livré à la garnison.',
        evalTips: 'Évaluer le discernement éthique, la fermeté sans cruauté et la gestion des renseignements.'
    },
    {
        id: 'sc-77',
        category: 'Négociation & Infiltration',
        title: 'Négociation avec un ennemi supérieur',
        desc: 'En situation de désavantage numérique total, l\'ennemi propose un trêve temporaire sous conditions d\'échange de matériel.',
        evalTips: 'Analyser le sang-froid, la finesse diplomatique sous menace directe et la protection des secrets du village.'
    },
    {
        id: 'sc-78',
        category: 'Négociation & Infiltration',
        title: 'Interrogatoire sous pression stratégique',
        desc: 'Un officier adverse capturé refuse de parler. Le temps presse avant l\'assaut nocturne. Quelle méthode d\'extraction utiliser ?',
        evalTips: 'Mesurer le respect des règles éthiques militaires sous forte urgence opérationnelle.'
    },
    {
        id: 'sc-79',
        category: 'Négociation & Infiltration',
        title: 'Protection des parchemins secrets',
        desc: 'En encerclement, le choix se pose entre brûler les parchemins d\'État secrets ou tenter de négocier la reddition de l\'unité.',
        evalTips: 'Mesurer la priorité absolue accordée à la sécurité nationale de Suna.'
    },
    {
        id: 'sc-80',
        category: 'Négociation & Infiltration',
        title: 'Infiltration d\'un marché clandestin',
        desc: 'Obtenir des pièces de rechange de marionnettes de contrebande en se fondant parmi des trafiquants armés.',
        evalTips: 'Évaluer l\'adaptabilité comportementale, la couverture et le sang-froid sous fausse identité.'
    },
    {
        id: 'sc-81',
        category: 'Négociation & Infiltration',
        title: 'Déchiffrement d\'un code ennemi',
        desc: 'Intercepter un message crypté annonçant une embuscade mais risquer d\'être repéré par la tour d\'écoute.',
        evalTips: 'Analyser l\'évaluation du ratio gain d\'information vs risque de détection.'
    },
    {
        id: 'sc-82',
        category: 'Négociation & Infiltration',
        title: 'Négociation d\'accès à un puits privé',
        desc: 'Convaincre le chef d\'une tribu nomade ombrageuse de laisser boire la patrouille sans sortir les armes.',
        evalTips: 'Observer la diplomatie culturelle et le respect des coutumes tribales du désert.'
    },
    {
        id: 'sc-83',
        category: 'Négociation & Infiltration',
        title: 'Double jeu lors d\'une fausse reddition',
        desc: 'Simuler une capitulation pour approcher le poste de commandement adverse et détruire leur radar.',
        evalTips: 'Évaluer la maîtrise des émotions trompeuses et l\'exécution du plan de ruse.'
    },
    {
        id: 'sc-84',
        category: 'Négociation & Infiltration',
        title: 'Passage clandestin d\'un poste de douane',
        desc: 'Faire passer 2 spations de renseignement à travers un contrôle douanier renforcé.',
        evalTips: 'Mesurer l\'assurance, la préparation des faux papiers et la maîtrise du stress.'
    },
    {
        id: 'sc-85',
        category: 'Négociation & Infiltration',
        title: 'Échange d\'otages au coucher du soleil',
        desc: 'Procéder à l\'échange d\'un diplomate de Suna contre un sous-officier ennemi au milieu d\'un terrain découvert.',
        evalTips: 'Observer le positionnement des snipers de couverture et le respect de la parole donnée.'
    },
    {
        id: 'sc-86',
        category: 'Négociation & Infiltration',
        title: 'Recrutement d\'un informateur local',
        desc: 'Convaincre un aubergiste endetté de fournir des détails sur les passages de patrouilles étrangères.',
        evalTips: 'Analyser la finesse d\'incitation psychologique sans menace de violence inutile.'
    },
    {
        id: 'sc-87',
        category: 'Négociation & Infiltration',
        title: 'Sabotage d\'une tour de communication',
        desc: 'Placer une charge de scellement silencieuse sur le mât de transmission ennemi sans neutraliser les gardes.',
        evalTips: 'Évaluer la discrétion d\'infiltration pure (Ghost Op).'
    },
    {
        id: 'sc-88',
        category: 'Négociation & Infiltration',
        title: 'Subornation d\'un garde de prison',
        desc: 'Offrir un pot-de-vin à un mercenaire gardant la porte arrière du centre de détention.',
        evalTips: 'Mesurer le sens de l\'opportunité et l\'estimation des motivations d\'autrui.'
    },
    {
        id: 'sc-89',
        category: 'Négociation & Infiltration',
        title: 'Neutralisation silencieuse au poison de sommeil',
        desc: 'Endormir les sentinelles du poste de guet en contaminant leur tisane du soir.',
        evalTips: 'Observer la préférence pour des méthodes non létales et propres.'
    },
    {
        id: 'sc-90',
        category: 'Négociation & Infiltration',
        title: 'Vol de documents secrets dans le bureau du gouverneur',
        desc: 'Infiltrer le palais de la ville frontière en se faisant passer pour du personnel de service.',
        evalTips: 'Évaluer l\'improvisation lors d\'une confrontation imprévue dans un couloir.'
    },
    {
        id: 'sc-91',
        category: 'Négociation & Infiltration',
        title: 'Désinformation d\'un espion infiltré',
        desc: 'Laisser fuiter volontairement un faux plan d\'attaque pour tromper l\'agent ennemi identifié.',
        evalTips: 'Analyser le niveau de stratégie de contre-spionnage.'
    },
    {
        id: 'sc-92',
        category: 'Négociation & Infiltration',
        title: 'Extraction d\'un scientifique déserteur',
        desc: 'Exfiltrer un ingénieur en marionnettes souhaitant fuir le pays voisin sous escorte discrète.',
        evalTips: 'Observer la protection de cibles civiles vulnérables lors d\'opérations de fuite.'
    },
    {
        id: 'sc-93',
        category: 'Négociation & Infiltration',
        title: 'Négociation de trêve d\'urgence sanitaire',
        desc: 'Obtenir une pause des tirs de 4 heures pour ramasser les blessés sur le champ de bataille.',
        evalTips: 'Évaluer l\'autorité morale et la capacité de conviction diplomatique.'
    },
    {
        id: 'sc-94',
        category: 'Négociation & Infiltration',
        title: 'Identification d\'un leurre magique',
        desc: 'Distinguer la vraie caravane stratégique parmi 3 faux convois d\'illusions dans le désert.',
        evalTips: 'Mesurer le sens de l\'observation analytique et de la détection de chakra.'
    },
    {
        id: 'sc-95',
        category: 'Négociation & Infiltration',
        title: 'Création d\'une fausse piste dans les dunes',
        desc: 'Laisser des empreintes et du matériel usagé pour diriger la patrouille de poursuite vers une impasse.',
        evalTips: 'Observer la créativité dans l\'art de l\'évasion.'
    },
    {
        id: 'sc-96',
        category: 'Négociation & Infiltration',
        title: 'Négociation de rachat de matériel confisqué',
        desc: 'Racheter un rouleau de scellement confisqué par des miliciens indépendants sans déclencher de conflit.',
        evalTips: 'Analyser la gestion des intérêts financiers et diplomatiques.'
    },
    {
        id: 'sc-97',
        category: 'Négociation & Infiltration',
        title: 'Infiltration par le réseau d\'égouts/aqueducs',
        desc: 'Pénétrer dans la forteresse en ruine en rampant dans les conduits d\'eau asséchés.',
        evalTips: 'Évaluer la tolérance aux environnements insalubres et à la claustrophobie.'
    },
    {
        id: 'sc-98',
        category: 'Négociation & Infiltration',
        title: 'Apaisement d\'une émeute locale',
        desc: 'Calmer une foule de villageois en colère protestant contre la réquisition temporaire de nourriture.',
        evalTips: 'Mesurer la communication publique pacifiante et la désescalade.'
    },
    {
        id: 'sc-99',
        category: 'Négociation & Infiltration',
        title: 'Paiement d\'un droit de passage à un pont',
        desc: 'Un garde corrompu exige une taxe prohibitive pour laisser traverser l\'escouade.',
        evalTips: 'Observer la négociation ferme de marchandage sans se faire extorquer.'
    },
    {
        id: 'sc-100',
        category: 'Négociation & Infiltration',
        title: 'Exfiltration d\'urgence sous couverture diplomatique',
        desc: 'Faire quitter le territoire ennemi à l\'escouade en s\'intégrant au convoi d\'un ambassadeur d\'un pays tiers.',
        evalTips: 'Évaluer la finesse stratégique globale et la maîtrise accomplie des opérations d\'infiltration.'
    }
];
