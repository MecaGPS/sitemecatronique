/**
 * Configuration centralisée du site Projet AGV
 */
const SITE_CONFIG = {
  title: 'Projet AGV',
  subtitle: 'Mécatronique — 4e année ICAM',
  team: [
    { name: 'Jean LAPORTE', role: 'Chef Projet', photo: 'portrait-jean.png', mission: 'Coordination globale, planning et validation des livrables.' },
    { name: 'Aurélien HUET', role: 'PMO', photo: 'portrait-aurelien.png', mission: 'Suivi de projet, gestion des risques et reporting.' },
    { name: 'Sacha DUQUESNOIS', role: 'Ingénieur Projet', photo: 'portrait-sacha.png', mission: 'Conception mécanique, simulations et intégration.' },
    { name: 'Vianney Roumazeilles', role: 'Ingénieur Projet', photo: 'portrait-vianney.png', mission: 'Électronique, câblage et architecture embarquée.' },
    { name: 'TCHINTOU Axelle', role: 'Ingénieur Projet', photo: 'portrait-axelle.png', mission: 'Logiciel embarqué, LiDAR et développement ROS2.' }
  ],
  nav: [
    { href: 'index.html', label: 'Accueil', section: 'vitrine' },
    { href: 'presentation.html', label: 'Projet', section: 'vitrine' },
    { href: 'cahier-des-charges.html', label: 'Cahier des charges', section: 'vitrine' },
    { href: 'essais-lidar.html', label: 'Essais LiDAR', section: 'vitrine' },
    { href: 'planning.html', label: 'Planning', section: 'vitrine' },
    { href: 'equipe.html', label: 'Équipe', section: 'vitrine' },
    { href: 'documents.html', label: 'Documents', section: 'vitrine' },
    { href: 'galerie.html', label: 'Galerie', section: 'vitrine' },
    { href: 'code.html', label: 'Code', section: 'vitrine' }
  ],
  documents: [
    { title: 'Vidéo AGV', file: 'video agv.mp4', type: 'Vidéo', category: 'presentation', desc: 'Vidéo de démonstration du véhicule AGV.' },
    { title: 'Photo assemblage AGV', file: 'assemblage agv.jpg', type: 'Image', category: 'conception', desc: 'Assemblage mécanique du prototype.' },
    { title: 'Paramétrage Raspberry Pi', file: 'Parametrage de la rasbery.jpg', type: 'Image', category: 'conception', desc: 'Configuration de la Raspberry Pi 5.' },
    { title: 'ROS2 — navigation embarquée', file: 'ross.png', type: 'Image', category: 'conception', desc: 'Capture de l\'interface ROS2 sur Raspberry Pi.' },
    { title: 'Cahier des charges fonctionnel', file: '_CdCF - Projet AGV .docx.pdf', type: 'PDF', category: 'cahier', desc: 'Cahier des charges fonctionnel du projet AGV.' },
    { title: 'Cahier de Conception', file: 'Cahier de Conception - Projet AGV .docx.pdf', type: 'PDF', category: 'conception', desc: 'Document de conception mécanique et électronique.' },
    { title: 'AGV Infos Pratiques', file: 'AGV_Infos_Pratiques.pdf', type: 'PDF', category: 'presentation', desc: 'Guide synthétique et informations clés du projet.' },
    { title: 'Présentation Décembre', file: 'Présentation_Décembre.pptx.pdf', type: 'PDF', category: 'presentation', desc: 'Support de présentation intermédiaire.' },
    { title: 'Liste Matériel AGV', file: 'Liste_Materiel_AGV.docx', type: 'DOCX', category: 'budget', desc: 'Inventaire complet des composants et matériels.' },
    { title: 'Modèle 3D — Assemblage AGV', file: 'Assemblage AGV.STEP', type: 'STEP', category: 'conception', desc: 'Fichier CAO assemblage complet.' },
    { title: 'Modèle 3D — Vue web interactive', file: 'assets/models/assemblage-agv.step', type: 'STEP', category: 'conception', desc: 'Copie du fichier STEP utilisée par la visionneuse 3D de la page d\'accueil.' },
    { title: 'Modèle 3D — Assemblage (eDrawings)', file: 'Assemblage AGV.easm', type: 'EASM', category: 'conception', desc: 'Visualisation assemblage eDrawings.' },
    { title: 'Photo groupe', file: 'Photo groupe.pptx', type: 'PPTX', category: 'equipe', desc: 'Présentation photo de l\'équipe projet.' },
    { title: 'Page Matériel (legacy)', file: 'materiel.html', type: 'HTML', category: 'budget', desc: 'Ancienne page liste matériel.' },
    { title: 'Documents techniques (legacy)', file: 'projet-final.html', type: 'HTML', category: 'presentation', desc: 'Ancienne page documents techniques.' },
    { title: 'Simulateur AGV (legacy)', file: 'simulateur/index.html', type: 'HTML', category: 'code', desc: 'Ancien simulateur de commande.' }
  ],
  gallery: [
    { src: 'video agv.mp4', title: 'Vidéo AGV', phase: 'Prototype', tag: 'prototype', type: 'video', desc: 'Vidéo de démonstration du véhicule AGV.' },
    { src: 'assemblage agv.jpg', title: 'Assemblage AGV', phase: 'Assemblage', tag: 'prototype', desc: 'Photo de l\'assemblage mécanique du prototype.' },
    { src: 'Parametrage de la rasbery.jpg', title: 'Paramétrage Raspberry Pi', phase: 'Électronique', tag: 'electronique', desc: 'Configuration et paramétrage de la Raspberry Pi 5.' },
    { src: 'ross.png', title: 'ROS2 — navigation embarquée', phase: 'Logiciel', tag: 'logiciel', desc: 'Interface ROS2 sur Raspberry Pi.' },
    { src: 'partie mecanique.jpg', title: 'Partie mécanique', phase: 'Conception', tag: 'mecanique', desc: 'Structure mécanique de l\'AGV.' },
    { src: 'modelisation.jpg', title: 'Modélisation 3D', phase: 'CAO', tag: 'mecanique', desc: 'Modèle 3D de l\'AGV.' },
    { src: 'etude statique.jpg', title: 'Étude statique', phase: 'Simulation', tag: 'mecanique', desc: 'Résultats de l\'étude statique.' },
    { src: 'etude dynamique.jpg', title: 'Étude dynamique', phase: 'Simulation', tag: 'mecanique', desc: 'Résultats de l\'étude dynamique.' },
    { src: 'simulation.jpg', title: 'Simulation', phase: 'Simulation', tag: 'mecanique', desc: 'Simulations numériques.' },
    { src: 'architecture electronique.jpg', title: 'Architecture électronique', phase: 'Électronique', tag: 'electronique', desc: 'Schéma électronique de l\'AGV.' },
    { src: 'agv.png', title: 'Vue AGV', phase: 'Prototype', tag: 'prototype', desc: 'Illustration du véhicule AGV.' },
    { src: 'photo agv.png', title: 'Chaîne de production', phase: 'Conception', tag: 'prototype', desc: 'Schéma de la chaîne avec les deux AGV.' },
    { src: 'proj.png', title: 'Projet AGV', phase: 'Conception', tag: 'mecanique', desc: 'Vue d\'ensemble du projet.' },
    { src: 'Poster .png', title: 'Affiche projet', phase: 'Présentation', tag: 'equipe', desc: 'Poster de présentation du projet.' },
    { src: 'lidar test.png', title: 'Test LiDAR', phase: 'Essais', tag: 'lidar', desc: 'Résultat des essais de détection LiDAR.' },
    { src: 'portrait-jean.png', title: 'Jean La Porte', phase: 'Équipe', tag: 'equipe', desc: 'Chef de Projet.' },
    { src: 'portrait-aurelien.png', title: 'Aurélien Huet', phase: 'Équipe', tag: 'equipe', desc: 'PMO.' },
    { src: 'portrait-sacha.png', title: 'Sacha Duquesnois', phase: 'Équipe', tag: 'equipe', desc: 'Ingénieur Projet.' },
    { src: 'portrait-vianney.png', title: 'Vianney Roumazeilles', phase: 'Équipe', tag: 'equipe', desc: 'Ingénieur Projet.' },
    { src: 'portrait-axelle.png', title: 'Axelle Tchintou', phase: 'Équipe', tag: 'equipe', desc: 'Ingénieur Projet.' }
  ],
  planning: [
    { phase: 'Phase 1', title: 'Analyse du besoin', status: 'done', desc: 'Identification du contexte industriel et des contraintes.' },
    { phase: 'Phase 2', title: 'Cahier des charges', status: 'done', desc: 'Rédaction et validation du CdCF.' },
    { phase: 'Phase 3', title: 'Choix de solutions', status: 'done', desc: 'Comparaison filoguidé / semi-auto / AMR classique.' },
    { phase: 'Phase 4', title: 'Conception mécanique', status: 'done', desc: 'Modélisation 3D, choix matériaux bois-plastique.' },
    { phase: 'Phase 5', title: 'Architecture électronique', status: 'done', desc: 'Schéma Raspberry Pi + Arduino Mega + capteurs.' },
    { phase: 'Phase 6', title: 'Achat composants', status: 'done', desc: 'Commande et réception du matériel (~867 €).' },
    { phase: 'Phase 7', title: 'Modélisation CAO', status: 'done', desc: 'Assemblage 3D complet exporté STEP/easm.' },
    { phase: 'Phase 8', title: 'Simulations', status: 'done', desc: 'Études statique, dynamique et ABS.' },
    { phase: 'Phase 9', title: 'Assemblage mécanique', status: 'done', desc: 'Montage châssis, carrosserie et roues.' },
    { phase: 'Phase 10', title: 'Développement logiciel', status: 'done', desc: 'ROS2, navigation embarquée, programmation Arduino.' },
    { phase: 'Phase 11', title: 'Essais LiDAR', status: 'done', desc: 'Tests de détection, cartographie et évitement.' },
    { phase: 'Phase 12', title: 'Tests navigation', status: 'done', desc: 'Validation des parcours AGV 1 et AGV 2.' },
    { phase: 'Phase 13', title: 'Corrections', status: 'done', desc: 'Ajustements suite aux essais.' },
    { phase: 'Phase 14', title: 'Intégration finale', status: 'done', desc: 'Assemblage complet et tests système.' },
    { phase: 'Phase 15', title: 'Soutenance', status: 'done', desc: 'Présentation finale devant le jury.' }
  ]
};
