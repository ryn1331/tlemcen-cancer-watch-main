-- Demo seed: 85 realistic patients + cancer cases
DO $$
DECLARE
  admin_id uuid := 'eeaa1f67-5d7a-4050-88dc-0746354571f5';
  noms text[] := ARRAY['Benali','Boudjemaa','Mansouri','Khelifi','Boumediene','Hadj','Saidi','Belkacem','Cherif','Meziane','Hamidi','Brahimi','Yacoubi','Tazi','Ammari','Bensalem','Daoudi','Ferhat','Ghazali','Hammou','Ibrahim','Kaddour','Larbi','Messaoudi','Naceri','Ouali','Rabah','Slimani','Tounsi','Zerrouki'];
  prenoms_m text[] := ARRAY['Mohamed','Ahmed','Ali','Omar','Karim','Yacine','Rachid','Said','Mustapha','Brahim','Abdelkader','Fouad','Nabil','Tarek','Hamid','Samir','Khaled','Lakhdar','Bachir','Djamel'];
  prenoms_f text[] := ARRAY['Fatima','Aicha','Khadija','Amina','Yasmina','Souad','Nadia','Samira','Karima','Houria','Zohra','Malika','Naima','Saliha','Latifa','Hafida','Nawel','Sabrina','Lila','Wahiba'];
  communes text[] := ARRAY['Tlemcen','Mansourah','Chetouane','Remchi','Ghazaouet','Maghnia','Sebdou','Hennaya','Nedroma','Ouled Mimoun','Ain Tallout','Honaine'];
  cancers text[] := ARRAY['Poumon','Colorectal','Sein','Prostate','Vessie','Estomac','Foie','Pancréas','Rein','Thyroïde','Leucémie','Lymphome','Mélanome','Col utérin','Ovaire','Cavité buccale','Larynx','Œsophage','Cerveau/SNC','Sarcome','Myélome','Autre'];
  topo text[] := ARRAY['C34.1','C18.7','C50.9','C61.9','C67.9','C16.0','C22.0','C25.0','C64.9','C73.9','C42.1','C82.9','C44.5','C53.9','C56.9','C06.9','C32.0','C15.9','C71.9','C49.9','C90.0','C76.0'];
  morpho text[] := ARRAY['8140/3','8480/3','8500/3','8070/3','8120/3','8260/3','8170/3','8211/3','8312/3','8340/3','9861/3','9680/3','8720/3','8070/3','8441/3','8071/3','8051/3','8070/3','9440/3','8801/3','9732/3','8000/3'];
  grades text[] := ARRAY['G1 — Bien différencié','G2 — Moyennement différencié','G3 — Peu différencié','G4 — Indifférencié','GX — Non évalué'];
  methodes text[] := ARRAY['histologie','histologie','histologie','cytologie','imagerie','clinique'];
  stades text[] := ARRAY['T1N0M0','T2N0M0','T2N1M0','T3N1M0','T3N2M0','T4N2M1','T2N1M1','T1N1M0','T4N3M1','T3N0M0'];
  statuts text[] := ARRAY['valide','valide','valide','valide','en_attente','en_attente','rejete'];
  vitals text[] := ARRAY['vivant','vivant','vivant','vivant','vivant','decede','perdu_de_vue'];
  i int;
  p_id uuid;
  is_male boolean;
  c_idx int;
  birth_date date;
  diag_date date;
  patient_nom text;
  patient_prenom text;
  patient_sexe text;
  cancer_type text;
BEGIN
  FOR i IN 1..85 LOOP
    is_male := (i % 2 = 0);
    patient_nom := noms[1 + (i % array_length(noms,1))];
    IF is_male THEN
      patient_prenom := prenoms_m[1 + (i % array_length(prenoms_m,1))];
      patient_sexe := 'M';
    ELSE
      patient_prenom := prenoms_f[1 + (i % array_length(prenoms_f,1))];
      patient_sexe := 'F';
    END IF;
    -- Age between 25 and 85
    birth_date := (CURRENT_DATE - ((25 + (i * 7) % 60) || ' years')::interval - (((i*13) % 365) || ' days')::interval)::date;
    diag_date := (CURRENT_DATE - (((i*11) % 730) || ' days')::interval)::date;
    c_idx := 1 + (i % array_length(cancers,1));
    cancer_type := cancers[c_idx];

    INSERT INTO public.patients (code_patient, nom, prenom, date_naissance, sexe, commune, wilaya, telephone, num_dossier, created_by)
    VALUES (
      'DEMO-' || LPAD(i::text, 4, '0'),
      patient_nom, patient_prenom, birth_date, patient_sexe,
      communes[1 + (i % array_length(communes,1))],
      'Tlemcen',
      '+213 5' || (50 + (i % 50))::text || ' ' || LPAD(((i*97)%1000)::text,3,'0') || ' ' || LPAD(((i*53)%1000)::text,3,'0'),
      'DOS-2026-' || LPAD(i::text, 4, '0'),
      admin_id
    ) RETURNING id INTO p_id;

    INSERT INTO public.cancer_cases (
      patient_id, type_cancer, code_icdo, topographie_icdo, morphologie_icdo,
      grade, lateralite, methode_diagnostic, milieu, stade_tnm,
      date_diagnostic, medecin_anapath, ref_anapath, resultat_anapath,
      tabagisme, alcool, sportif, statut_vital, statut, created_by,
      symptomes, base_diagnostic, source_info
    ) VALUES (
      p_id, cancer_type, topo[c_idx], topo[c_idx], morpho[c_idx],
      grades[1 + (i % array_length(grades,1))],
      CASE (i % 3) WHEN 0 THEN 'Droite' WHEN 1 THEN 'Gauche' ELSE 'Non applicable' END,
      methodes[1 + (i % array_length(methodes,1))],
      CASE (i % 3) WHEN 0 THEN 'rural' WHEN 1 THEN 'semi-urbain' ELSE 'urbain' END,
      stades[1 + (i % array_length(stades,1))],
      diag_date,
      'Dr. ' || noms[1 + ((i+3) % array_length(noms,1))],
      'AP-2026-' || LPAD(i::text, 4, '0'),
      'Carcinome ' || cancer_type || ' confirmé histologiquement. Marges saines.',
      CASE WHEN is_male AND (i % 4 = 0) THEN 'oui' WHEN i % 7 = 0 THEN 'ancien' ELSE 'non' END,
      CASE WHEN is_male AND (i % 5 = 0) THEN 'oui' ELSE 'non' END,
      CASE WHEN i % 6 = 0 THEN 'oui' ELSE 'non' END,
      vitals[1 + (i % array_length(vitals,1))],
      statuts[1 + (i % array_length(statuts,1))],
      admin_id,
      CASE (i % 5)
        WHEN 0 THEN 'Toux persistante, dyspnée, perte de poids'
        WHEN 1 THEN 'Asthénie, amaigrissement, douleur abdominale'
        WHEN 2 THEN 'Masse palpable, adénopathie'
        WHEN 3 THEN 'Hématurie, douleurs lombaires'
        ELSE 'Découverte fortuite imagerie'
      END,
      'Histologie de la tumeur primitive',
      CASE (i % 3) WHEN 0 THEN 'CHU Tlemcen — Service Oncologie' WHEN 1 THEN 'EPH Maghnia' ELSE 'Cabinet privé' END
    );
  END LOOP;
END $$;