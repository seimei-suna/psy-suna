-- ============================================================
-- SEIMEI - SUNA : GRADE FUDAN SHŌ (v4)
-- À exécuter UNE FOIS dans l'éditeur SQL du projet Supabase, après
-- SQL_psy.sql, SQL_psy_v2.sql et SQL_psy_v3.sql.
--
-- Ajoute le rôle "fudan_sho" : accès en lecture uniquement au
-- RÉSULTAT (niveau de dangerosité + synthèse) des évaluations Camp de
-- Redressement, jamais aux réponses données ni aux points obtenus.
-- ============================================================

alter table psy_membres drop constraint if exists psy_membres_role_check;
alter table psy_membres add constraint psy_membres_role_check
  check (role in ('psychologue', 'gerance_psy', 'seimei', 'fudan_sho'));
