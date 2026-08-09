-- ============================================================
-- SEIMEI - SUNA : PALIER "TRÈS ÉLEVÉ" (v5)
-- À exécuter UNE FOIS dans l'éditeur SQL du projet Supabase, après
-- SQL_psy.sql, SQL_psy_v2.sql, SQL_psy_v3.sql et SQL_psy_v4.sql.
--
-- Ajoute "tres_eleve" aux niveaux de dangerosité autorisés pour les
-- évaluations Camp de Redressement (score 0-16/60).
-- ============================================================

alter table psy_camp_evaluations drop constraint if exists psy_camp_evaluations_niveau_dangerosite_check;
alter table psy_camp_evaluations add constraint psy_camp_evaluations_niveau_dangerosite_check
  check (niveau_dangerosite in ('faible_modere', 'modere_eleve', 'eleve', 'tres_eleve'));
