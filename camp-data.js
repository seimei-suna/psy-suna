/* ==========================================================================
   SEIMEI - SUNA : camp-data.js
   Questionnaire Psychologique — Évaluation Mentale (Cellule Psychologique
   de Sunagakure), utilisé pour l'évaluation initiale des suivis "Camp de
   redressement". Source : document QCM Psychologique fourni par la Gérance.
   Chaque question est notée 1, 2 ou 3 points par le psychologue selon la
   réponse ouverte du sujet ; le total (20 à 60 pts) détermine l'état
   mental / niveau de dangerosité via CAMP_DANGER_TIERS.
   ========================================================================== */

const CAMP_QUESTIONS = [
    "Lorsque quelqu'un vous humilie devant d'autres personnes, quelle est votre première pensée ?",
    "Vous entrez dans une pièce remplie de blessés après une attaque. Quelle émotion ressentez-vous en premier ?",
    "Si vous pouviez effacer une personne sans aucune conséquence, que feriez-vous ?",
    "Quand vous repensez aux personnes que vous avez blessées, que ressentez-vous ?",
    "Une voix dans votre tête vous répète que tout le monde vous méprise. Que faites-vous ?",
    "Vous trouvez quelqu'un inconscient après un combat. Quelle serait votre réaction instinctive ?",
    "Que représente le sang pour vous ?",
    "Si un proche vous trahissait, comment réagiriez-vous ?",
    "Lorsqu'on vous regarde avec peur, que ressentez-vous ?",
    "Si vous pouviez faire disparaître toutes vos émotions immédiatement, les accepteriez-vous ?",
    "Si vous pouviez revivre votre pire souvenir, que feriez-vous ?",
    "Lorsque vous regardez quelqu'un dormir sans défense, quelle pensée vous traverse l'esprit ?",
    "Si le village vous rejetait totalement demain, que feriez-vous ?",
    "Vous voyez quelqu'un pleurer après avoir perdu un proche. Quelle est votre réaction ?",
    "Avez-vous déjà eu envie de voir jusqu'où quelqu'un pouvait souffrir avant de craquer ?",
    "Quand vous êtes seul la nuit, quelles pensées reviennent le plus souvent ?",
    "Si une personne innocente devait mourir pour atteindre votre objectif, que feriez-vous ?",
    "Que ressentez-vous après avoir fait peur à quelqu'un ?",
    "Avez-vous déjà eu l'impression que les autres ne sont pas réellement humains comme vous ?",
    "Si vous pouviez faire disparaître toute votre douleur en échange de celle d'un inconnu, accepteriez-vous ?"
];

// Score total possible : 20 (20 x 1pt, réponses les plus alarmantes) à 60
// (20 x 3pts, réponses les plus saines). Barème "qualité de la réponse" :
// 1 = réponse alarmante/nulle, 2 = modérée, 3 = réponse saine/bonne.
// Un score BAS traduit donc un niveau de dangerosité ÉLEVÉ, et inversement.
const CAMP_DANGER_TIERS = [
    {
        id: 'faible_modere',
        min: 47, max: 60,
        label: 'FAIBLE À MODÉRÉ',
        badgeClass: 'risque-aucun',
        description: "Le sujet semble conserver une empathie fonctionnelle, garder une perception stable de la morale, et présenter une capacité de recul émotionnel malgré les traumatismes vécus. Une surveillance légère peut rester recommandée selon le contexte."
    },
    {
        id: 'modere_eleve',
        min: 34, max: 46,
        label: 'MODÉRÉ À ÉLEVÉ',
        badgeClass: 'risque-preoccupant',
        description: "Le sujet présente une instabilité psychologique notable, des pensées agressives récurrentes, des traumatismes importants, et une morale fluctuante selon les situations. Le sujet conserve certaines limites mentales mais reste vulnérable à une dérive plus grave."
    },
    {
        id: 'eleve',
        min: 20, max: 33,
        label: 'ÉLEVÉ',
        badgeClass: 'risque-urgent',
        description: "Le sujet présente une forte désensibilisation émotionnelle, une fascination pour la violence, une rupture importante avec l'empathie humaine, ainsi qu'un risque élevé de comportement dangereux ou homicidaire. Le sujet peut représenter une menace directe pour son entourage et pour la stabilité du village."
    }
];

function getCampDangerTier(score) {
    return CAMP_DANGER_TIERS.find(t => score >= t.min && score <= t.max) || CAMP_DANGER_TIERS[CAMP_DANGER_TIERS.length - 1];
}
