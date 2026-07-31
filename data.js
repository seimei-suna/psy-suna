/* ==========================================================================
   SEIMEI - SUNA : RÉFÉRENTIEL OFFICIEL PARTAGÉ
   Données communes à l'outil psychologue (app.js), à l'auto-test patient
   (auto-test.js) et à la page de consultation gérance (referentiel.html).
   Chargé avant tout autre script — pas de module, variables globales
   partagées entre fichiers <script> classiques.
   ========================================================================== */

// ── 8 critères cliniques (2. CRITÈRES D'APPRÉCIATION CLINIQUE) ──
const CRITERIA_DATA = [
    {
        id: 1,
        title: "Stabilité émotionnelle perçue",
        desc: "Capacité du shinobi à conserver un équilibre émotionnel face aux événements vécus.",
        subItems: ["Maîtrise de soi", "Variations émotionnelles", "Capacité à verbaliser son vécu", "Gestion du stress", "Récupération après situation difficile"]
    },
    {
        id: 2,
        title: "Fiabilité opérationnelle",
        desc: "Capacité à rester efficace dans des conditions changeantes.",
        subItems: ["Attention et concentration", "Résistance à la pression", "Rigueur dans l'exécution", "Respect des consignes"]
    },
    {
        id: 3,
        title: "Engagement envers Sunagakure",
        desc: "Nature et sincérité de la volonté de servir le village et de protéger ses alliés.",
        subItems: ["Motivation et engagement", "Loyauté perçue", "Sens du devoir", "Raisons personnelles"]
    },
    {
        id: 4,
        title: "Discernement sous pression",
        desc: "Capacité à prendre des décisions adaptées malgré le stress, l'urgence ou l'incertitude.",
        subItems: ["Jugement tactique", "Contrôle de l'impulsivité", "Analyse des conséquences", "Choix cohérents et adaptés"]
    },
    {
        id: 5,
        title: "Cohésion avec la hiérarchie",
        desc: "Qualité des relations professionnelles et respect de la chaîne de commandement.",
        subItems: ["Communication", "Travail d'équipe", "Respect de la hiérarchie", "Confiance inspirée", "Coopération"]
    },
    {
        id: 6,
        title: "Capacité d'adaptation",
        desc: "Capacité à ajuster son comportement face aux imprévus ou aux changements de situation.",
        subItems: ["Réactivité", "Souplesse mentale", "Gestion de l'imprévu", "Adaptation", "Apprentissage rapide"]
    },
    {
        id: 7,
        title: "Influence sur son entourage",
        desc: "Impact du shinobi sur ses coéquipiers et son environnement.",
        subItems: ["Leadership naturel", "Capacité à rassurer", "Gestion des conflits", "Motivation des autres", "Présence positive"]
    },
    {
        id: 8,
        title: "Disponibilité psychique au service",
        desc: "État mental général permettant une reprise sereine et durable du service.",
        subItems: ["Énergie mentale", "Clarté d'esprit", "Résilience", "Fatigue psychologique", "Préparation au service"]
    }
];

// ── 6.1 Échelle d'appréciation par critère (0 à 5 points) ──
const RATING_LEVELS = [
    { pts: 5, label: 'Excellent', desc: 'Aucun élément préoccupant. Capacités pleinement compatibles.', cls: 'lvl-excellent' },
    { pts: 4, label: 'Bon',       desc: 'Quelques réserves mineures sans conséquence opérationnelle.', cls: 'lvl-bon' },
    { pts: 3, label: 'Moyen',     desc: 'Plusieurs éléments nécessitant surveillance ou suivi.', cls: 'lvl-moyen' },
    { pts: 2, label: 'Fragile',   desc: 'Difficultés importantes pouvant affecter le service.', cls: 'lvl-fragile' },
    { pts: 1, label: 'Critique',  desc: 'État compromettant sérieusement l\'aptitude opérationnelle.', cls: 'lvl-critique' },
    { pts: 0, label: 'Inapte',    desc: 'État incompatible avec la poursuite des missions.', cls: 'lvl-inapte' }
];

// ── 6.2 Pondération officielle du référentiel ──
const BAREME = {
    NB_CRITERIA: 8,          // 8 critères × 5 pts
    MAX_CRITERIA: 40,
    NB_SCENARIOS: 3,         // 3 mises en situation × 3 pts
    MAX_PER_SCENARIO: 3,
    MAX_SCENARIOS: 9,
    MAX_BONUS: 2,             // bonus cliniques plafonnés à +2
    MAX_TOTAL: 52
};

// ── 4. Diagnostics psychologiques (malus, cumulables) ──
const MALUS_DATA = {
    light: [
        { id: 'm-1', label: 'Stress léger', pts: 2 },
        { id: 'm-2', label: 'Fatigue mentale', pts: 2 },
        { id: 'm-3', label: 'Manque de confiance', pts: 2 },
        { id: 'm-4', label: 'Difficulté de concentration', pts: 2 },
        { id: 'm-5', label: 'Irritabilité passagère', pts: 2 }
    ],
    moderate: [
        { id: 'm-6', label: 'Stress post-traumatique', pts: 4 },
        { id: 'm-7', label: 'Culpabilité importante', pts: 4 },
        { id: 'm-8', label: 'Instabilité émotionnelle', pts: 4 },
        { id: 'm-9', label: 'Impulsivité', pts: 4 },
        { id: 'm-10', label: 'Isolement social', pts: 4 }
    ],
    severe: [
        { id: 'm-11', label: 'Refus d\'obéir', pts: 6 },
        { id: 'm-12', label: 'Hallucinations', pts: 6 },
        { id: 'm-13', label: 'Perte de contrôle', pts: 6 },
        { id: 'm-14', label: 'Risque pour l\'équipe', pts: 6 },
        { id: 'm-15', label: 'Dangerosité potentielle', pts: 6 }
    ]
};

// ── 5. Bonus cliniques (facultatifs, +1 chacun, plafonnés à +2) ──
const BONUS_DATA = [
    { id: 'b-1', label: 'Sang-froid exceptionnel', desc: 'Maîtrise parfaite lors des crises imprévues', pts: 1 },
    { id: 'b-2', label: 'Leadership remarquable', desc: 'Mobilisation efficace du groupe', pts: 1 },
    { id: 'b-3', label: 'Grande résilience', desc: 'Capacité supérieure de récupération', pts: 1 },
    { id: 'b-4', label: 'Esprit d\'équipe exemplaire', desc: 'Altruisme et soutien constant', pts: 1 }
];

// ── 7. Décision finale selon le score final (0-52) ──
// patientMessage : seul texte visible par le shinobi lors d'un auto-test
// (jamais le score ni le détail clinique).
const DECISIONS = [
    {
        min: 40, max: 52,
        title: "MAINTIEN DU GRADE",
        statusClass: "status-maintien",
        dotColor: "🟢",
        description: "Aucune restriction. Le shinobi est considéré comme pleinement apte à reprendre le service.",
        generalDiagnosis: "Aptitude optimale au combat — Aucune séquelle clinique",
        reevalDate: "12 mois",
        patientMessage: "Test terminé — vous n'avez pas besoin de contacter un psychologue."
    },
    {
        min: 34, max: 39,
        title: "MAINTIEN DU GRADE AVEC RECOMMANDATIONS",
        statusClass: "status-recommandations",
        dotColor: "🟢",
        description: "L'aptitude est confirmée. Un suivi psychologique ou des recommandations peuvent être proposés selon l'appréciation du psychologue.",
        generalDiagnosis: "Aptitude opérationnelle confirmée — recommandations facultatives",
        reevalDate: "6 mois",
        patientMessage: "Test terminé — vous pouvez contacter un psychologue si vous le souhaitez."
    },
    {
        min: 28, max: 33,
        title: "MAINTIEN DU GRADE AVEC RESTRICTIONS TEMPORAIRES",
        statusClass: "status-restrictions",
        dotColor: "🟡",
        description: "Restriction de certaines missions (A/S, commandement, missions sensibles) jusqu'à une nouvelle évaluation.",
        generalDiagnosis: "Vulnérabilité modérée — restrictions opérationnelles ciblées",
        reevalDate: "30 jours",
        patientMessage: "Test terminé — contactez dès que possible un psychologue pour une nouvelle évaluation. Vous n'êtes pas autorisé à commander ni à réaliser de missions sensibles en attendant."
    },
    {
        min: 22, max: 27,
        title: "SUIVI RENFORCÉ",
        statusClass: "status-suivi-renforce",
        dotColor: "🟠",
        description: "Le shinobi reste en service, mais avec un accompagnement psychologique obligatoire et des limitations opérationnelles décidées par la hiérarchie.",
        generalDiagnosis: "Altération significative nécessitant un accompagnement rapproché",
        reevalDate: "14 jours",
        patientMessage: "Test terminé — contactez un psychologue au plus vite."
    },
    {
        min: 15, max: 21,
        title: "SUSPENSION TEMPORAIRE DES MISSIONS",
        statusClass: "status-suspension",
        dotColor: "🔴",
        description: "Inaptitude opérationnelle temporaire. Une réévaluation est obligatoire avant toute reprise.",
        generalDiagnosis: "Inaptitude temporaire — soins psychologiques prescrits",
        reevalDate: "7 jours",
        patientMessage: "Test terminé — contactez un psychologue au plus vite. Vous êtes considéré comme temporairement inapte."
    },
    {
        min: 0, max: 14,
        title: "RÉTROGRADATION TEMPORAIRE AU GRADE INFÉRIEUR",
        statusClass: "status-retrogradation",
        dotColor: "⚫",
        description: "Décision exceptionnelle motivée par un risque important pour le shinobi, son unité ou le village. Une nouvelle évaluation est nécessaire avant toute réintégration.",
        generalDiagnosis: "Inaptitude critique constatée — risque majeur pour l'unité",
        reevalDate: "60 jours",
        patientMessage: "Test terminé — contactez un psychologue au plus vite. Une nouvelle évaluation est nécessaire avant toute réintégration dans l'armée de Suna."
    }
];

// Renvoie la tranche de décision correspondant à un score (0-52)
function getDecisionForScore(score) {
    const s = Math.max(0, Math.min(BAREME.MAX_TOTAL, score));
    return DECISIONS.find(d => s >= d.min && s <= d.max) || DECISIONS[DECISIONS.length - 1];
}
