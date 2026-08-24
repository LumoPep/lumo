export interface ResearchStudy {
  title: string
  authors: string
  journal: string
  year: number
  pmid?: string
  doi?: string
  url: string
  summary: string
}

export const PRODUCT_RESEARCH: Record<string, ResearchStudy[]> = {
  'bpc-157': [
    {
      title: 'Stable Gastric Pentadecapeptide BPC 157',
      authors: 'Seiwerth S, Milavic M, Vukojevic J, et al.',
      journal: 'Frontiers in Pharmacology',
      year: 2021,
      pmid: '34276386',
      doi: '10.3389/fphar.2021.627533',
      url: 'https://pubmed.ncbi.nlm.nih.gov/34276386/',
      summary: 'Reviews BPC-157 mechanistic activity across multiple preclinical tissue models, characterising route-of-administration pharmacology and fibroblast signalling responses.',
    },
    {
      title: 'Regeneration or Risk? A Narrative Review of BPC-157',
      authors: 'Liao H-J, Chen H-T, Chang C-H, et al.',
      journal: 'Current Sports Medicine Reports',
      year: 2025,
      pmid: '40789979',
      url: 'https://pubmed.ncbi.nlm.nih.gov/40789979/',
      summary: 'Documents BPC-157 mechanisms including VEGFR2 activation, Akt-eNOS nitric oxide synthesis, and ERK1/2 signalling that drive angiogenesis, fibroblast activity, and neuromuscular stabilisation in preclinical tissue models.',
    },
    {
      title: 'Emerging Use of BPC-157 in Orthopaedic Sports Medicine: A Systematic Review',
      authors: 'Vasireddi N, Hahamyan H, Salata MJ, et al.',
      journal: 'Sports Health',
      year: 2025,
      pmid: '40184576',
      doi: '10.1177/15563316251355551',
      url: 'https://pubmed.ncbi.nlm.nih.gov/40184576/',
      summary: 'Systematic review of 36 preclinical studies (1993–2024) characterising BPC-157 mechanisms including growth factor upregulation and signalling pathway activation across musculoskeletal tissue models.',
    },
  ],

  'tb-500': [
    {
      title: 'Simultaneous Quantification of TB-500 and Its Metabolites',
      authors: 'Rahaman KA, Muresan AR, Min H, et al.',
      journal: 'Journal of Chromatography B',
      year: 2024,
      pmid: '38237358',
      doi: '10.1016/j.jchromb.2024.124033',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38237358/',
      summary: 'Characterises TB-500 and metabolite pharmacokinetics via chromatographic separation, identifying the LKKTETQ core fragment as the bioactive component in vitro.',
    },
    {
      title: 'Utilizing Developmentally Essential Secreted Peptides Such as Thymosin Beta-4 to Remind the Adult Organs of Their Embryonic State',
      authors: 'Maar K, Hetenyi R, Maar S, et al.',
      journal: 'Cells',
      year: 2021,
      pmid: '34071596',
      doi: '10.3390/cells10061343',
      url: 'https://pubmed.ncbi.nlm.nih.gov/34071596/',
      summary: 'Reviews Thymosin Beta-4 mechanisms including actin sequestration, cell migration, angiogenesis, and anti-apoptotic signalling across neural and connective tissue models.',
    },
    {
      title: 'Thymosin Beta 4',
      authors: 'Malinda KM, Sidhu GS, Mani H, et al.',
      journal: 'Journal of Investigative Dermatology',
      year: 1999,
      pmid: '10469325',
      doi: '10.1046/j.1523-1747.1999.00708.x',
      url: 'https://pubmed.ncbi.nlm.nih.gov/10469325/',
      summary: 'Foundational rodent study characterising Thymosin Beta-4 effects on dermal matrix deposition, angiogenesis, and fibroblast activity following topical and systemic administration.',
    },
  ],

  'bpc-tb-blend': [
    {
      title: 'Stable Gastric Pentadecapeptide BPC 157',
      authors: 'Seiwerth S, Milavic M, Vukojevic J, et al.',
      journal: 'Frontiers in Pharmacology',
      year: 2021,
      pmid: '34276386',
      doi: '10.3389/fphar.2021.627533',
      url: 'https://pubmed.ncbi.nlm.nih.gov/34276386/',
      summary: 'Reviews BPC-157 mechanistic activity across multiple preclinical tissue models, characterising route-of-administration pharmacology.',
    },
    {
      title: 'Utilizing Developmentally Essential Secreted Peptides Such as Thymosin Beta-4 to Remind the Adult Organs of Their Embryonic State',
      authors: 'Maar K, Hetenyi R, Maar S, et al.',
      journal: 'Cells',
      year: 2021,
      pmid: '34071596',
      doi: '10.3390/cells10061343',
      url: 'https://pubmed.ncbi.nlm.nih.gov/34071596/',
      summary: 'Reviews Thymosin Beta-4 signalling including actin sequestration, angiogenesis, and anti-apoptotic effects across multiple tissue models.',
    },
  ],

  'ipamorelin': [
    {
      title: 'Ipamorelin, the First Selective Growth Hormone Secretagogue',
      authors: 'Raun K, Hansen BS, Johansen NL, et al.',
      journal: 'European Journal of Endocrinology',
      year: 1998,
      pmid: '9849822',
      doi: '10.1530/eje.0.1390552',
      url: 'https://pubmed.ncbi.nlm.nih.gov/9849822/',
      summary: 'Characterises Ipamorelin as a selective GHS-R1a agonist with potency comparable to GHRP-6 but without significant cortisol, prolactin, or ACTH stimulation — establishing its selectivity profile.',
    },
    {
      title: 'Growth Hormone Secretagogues',
      authors: 'Isidro ML, Cordido F.',
      journal: 'Combinatorial Chemistry & High Throughput Screening',
      year: 2006,
      pmid: '16533150',
      doi: '10.2174/138620706776055458',
      url: 'https://pubmed.ncbi.nlm.nih.gov/16533150/',
      summary: 'Reviews the pharmacology of growth hormone secretagogues including receptor binding, pituitary selectivity, and GHS class characterisation.',
    },
  ],

  'cjc-1295-no-dac': [
    {
      title: 'Ipamorelin, the First Selective Growth Hormone Secretagogue',
      authors: 'Raun K, Hansen BS, Johansen NL, et al.',
      journal: 'European Journal of Endocrinology',
      year: 1998,
      pmid: '9849822',
      doi: '10.1530/eje.0.1390552',
      url: 'https://pubmed.ncbi.nlm.nih.gov/9849822/',
      summary: 'Foundational pharmacology paper establishing selectivity of GHS-R1a agonism for the GH axis, relevant to understanding combined GHRH/GHRP research protocols.',
    },
  ],

  'cjc-ipamorelin': [
    {
      title: 'Ipamorelin, the First Selective Growth Hormone Secretagogue',
      authors: 'Raun K, Hansen BS, Johansen NL, et al.',
      journal: 'European Journal of Endocrinology',
      year: 1998,
      pmid: '9849822',
      doi: '10.1530/eje.0.1390552',
      url: 'https://pubmed.ncbi.nlm.nih.gov/9849822/',
      summary: 'Establishes Ipamorelin as a selective GHS-R1a agonist without cortisol or prolactin effects, providing the complementary GH pulse axis for the CJC/Ipamorelin dual-mechanism blend.',
    },
    {
      title: 'Synergistic Effects of GHRH and GHRP on Growth Hormone Secretion In Vivo',
      authors: 'Bowers CY, Sartor AO, Reynolds GA, Badger TM.',
      journal: 'Endocrinology',
      year: 1991,
      pmid: '1846653',
      doi: '10.1210/endo-128-1-305',
      url: 'https://pubmed.ncbi.nlm.nih.gov/1846653/',
      summary: 'Early in vivo study demonstrating that co-administration of GHRH and a GHRP produces a synergistic GH response significantly greater than either compound alone — the mechanistic basis for combined secretagogue research.',
    },
  ],

  'tesamorelin': [],

  'ghk-cu': [
    {
      title: 'GHK Peptide as a Natural Modulator of Multiple Cellular Pathways',
      authors: 'Pickart L, Vasquez-Soltero JM, Margolina A.',
      journal: 'BioMed Research International',
      year: 2015,
      pmid: '26236730',
      doi: '10.1155/2015/648108',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26236730/',
      summary: 'Reviews GHK-Cu mechanisms including metalloproteinase modulation and immune cell recruitment characterisation in dermal research models.',
    },
    {
      title: 'Regenerative and Protective Actions of the GHK-Cu Peptide in the Light of the New Gene Data',
      authors: 'Pickart L, Margolina A.',
      journal: 'International Journal of Molecular Sciences',
      year: 2018,
      pmid: '30011851',
      doi: '10.3390/ijms19071987',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30011851/',
      summary: 'Documents GHK-Cu modulation of over 4,000 gene targets, characterising effects on DNA repair, antioxidant response, and signalling pathway gene expression.',
    },
  ],

  'nad-plus': [
    {
      title: 'NAD+ Metabolism and Its Roles in Cellular Processes During Aging',
      authors: 'Covarrubias AJ, Perrone R, Grozio A, Verdin E.',
      journal: 'Nature Reviews Molecular Cell Biology',
      year: 2021,
      pmid: '33353981',
      doi: '10.1038/s41580-020-00313-x',
      url: 'https://pubmed.ncbi.nlm.nih.gov/33353981/',
      summary: 'Comprehensive review of NAD+ biosynthesis, consumption pathways (sirtuins, PARPs, CD38), and the metabolic consequences of age-related NAD+ decline across tissues.',
    },
    {
      title: 'NAD+ and Sirtuins in Aging and Disease',
      authors: 'Imai S, Guarente L.',
      journal: 'Trends in Cell Biology',
      year: 2014,
      pmid: '24786309',
      doi: '10.1016/j.tcb.2014.04.002',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24786309/',
      summary: 'Reviews the NAD-sirtuin axis as a central regulator of cellular metabolism, characterising NAD+-dependent deacetylase signalling pathways and their downstream effects.',
    },
  ],

  'selank': [
    {
      title: 'Intranasal Administration of the Peptide Selank Regulates BDNF Expression in the Rat Hippocampus In Vivo',
      authors: 'Inozemtseva LS, Karpenko EA, Dolotov OV, et al.',
      journal: 'Doklady Biological Sciences',
      year: 2008,
      pmid: '18841804',
      doi: '10.1134/s0012496608040066',
      url: 'https://pubmed.ncbi.nlm.nih.gov/18841804/',
      summary: 'Demonstrates that intranasal Selank elevates hippocampal BDNF expression in vivo, characterising its neurotrophin-based signalling mechanism.',
    },
    {
      title: 'Experimental Optimisation of Learning by Selank',
      authors: 'Semenova TP, Kozlovskiy II, Zakharova NM, Kozlovskaya MM.',
      journal: 'Experimental and Clinical Pharmacology',
      year: 2010,
      pmid: '20919548',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20919548/',
      summary: 'Characterises spatial learning consolidation metrics in rodent models following Selank administration, profiling its CNS signalling mechanism.',
    },
  ],

  'semax': [
    {
      title: 'Mechanisms of Semax Action: Regulation of Antioxidant Pathways and Gene Expression',
      authors: 'Medvedev AE, et al.',
      journal: 'Bulletin of Experimental Biology and Medicine',
      year: 2014,
      pmid: '24770788',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24770788/',
      summary: 'Characterises Semax mechanism of action via antioxidant enzyme upregulation, mitochondrial stabilisation under calcium stress, and inhibition of nitric oxide synthesis.',
    },
  ],

  'epithalon': [
    {
      title: 'Epithalon Peptide Induces Telomerase Activity and Telomere Elongation in Human Somatic Cells',
      authors: 'Khavinson VK, Bondarev IE, Butyugov AA.',
      journal: 'Bulletin of Experimental Biology and Medicine',
      year: 2003,
      pmid: '12937682',
      doi: '10.1023/A:1025493705728',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12937682/',
      summary: 'Key in vitro study reporting that Epithalon (AEDG tetrapeptide) induces telomerase activity and produces measurable telomere elongation in human somatic cell cultures.',
    },
  ],

  'mots-c': [
    {
      title: 'A Mitochondrial-Derived Peptide MOTS-c Regulates Glucose and Fatty Acid Metabolism',
      authors: 'Lee C, Zeng J, Drew BG, et al.',
      journal: 'Cell Metabolism',
      year: 2015,
      pmid: '25738459',
      doi: '10.1016/j.cmet.2015.01.020',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25738459/',
      summary: 'Discovery paper identifying MOTS-c as a mitochondrially encoded peptide that activates AMPK and modulates glucose and fatty acid metabolism in murine models.',
    },
    {
      title: 'MOTS-c: A Novel Mitochondrial-Derived Peptide Regulating Muscle and Fat Metabolism',
      authors: 'Lee C, Kim KH, Cohen P.',
      journal: 'Free Radical Biology & Medicine',
      year: 2016,
      pmid: '27216708',
      doi: '10.1016/j.freeradbiomed.2016.05.015',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27216708/',
      summary: 'Reviews MOTS-c biology including its nuclear translocation under metabolic stress conditions and AMPK-mediated metabolic reprogramming pathways.',
    },
  ],

  'lp-tz': [],

  'lp-rt': [],

  'glow-blend': [
    {
      title: 'GHK Peptide as a Natural Modulator of Multiple Cellular Pathways',
      authors: 'Pickart L, Vasquez-Soltero JM, Margolina A.',
      journal: 'BioMed Research International',
      year: 2015,
      pmid: '26236730',
      doi: '10.1155/2015/648108',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26236730/',
      summary: 'Reviews GHK-Cu fibroblast-activating and metalloproteinase mechanisms in dermal research models.',
    },
    {
      title: 'Stable Gastric Pentadecapeptide BPC 157',
      authors: 'Seiwerth S, Milavic M, Vukojevic J, et al.',
      journal: 'Frontiers in Pharmacology',
      year: 2021,
      pmid: '34276386',
      doi: '10.3389/fphar.2021.627533',
      url: 'https://pubmed.ncbi.nlm.nih.gov/34276386/',
      summary: 'Reviews BPC-157 mechanisms across multiple preclinical models, characterising pathway activity relevant to tissue biology research.',
    },
  ],

  'klow-blend': [],

  'bac-water': [],

  'kpv': [
    {
      title: 'PepT1-Mediated Tripeptide KPV Uptake',
      authors: 'Dalmasso G, Charrier-Hisamuddin L, Nguyen HT, et al.',
      journal: 'Gastroenterology',
      year: 2008,
      pmid: '18061177',
      url: 'https://pubmed.ncbi.nlm.nih.gov/18061177/',
      summary: 'Characterises KPV-mediated NF-kB and MAP kinase signalling via PepT1-mediated cellular uptake in murine gastrointestinal tissue models.',
    },
    {
      title: 'Core and C-Terminal (KPV) Alpha-MSH Peptide Receptor Pathway Characterisation',
      authors: 'Getting SJ, Allcock GH, Flower R, Perretti M.',
      journal: 'Journal of Pharmacology and Experimental Therapeutics',
      year: 2003,
      pmid: '12750433',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12750433/',
      summary: 'Characterises KPV mechanism via non-melanocortin-receptor pathway, distinguishing it from core alpha-MSH peptides in crystal-induced peritonitis models.',
    },
    {
      title: 'Antimicrobial Effects of Alpha-MSH Peptides',
      authors: 'Cutuli M, Cristiani S, Lipton JM, Catania A.',
      journal: 'Journal of Leukocyte Biology',
      year: 2000,
      pmid: '10670585',
      url: 'https://pubmed.ncbi.nlm.nih.gov/10670585/',
      summary: 'Demonstrates that alpha-MSH and its C-terminal tripeptide KPV exhibit antimicrobial activity against S. aureus and C. albicans across a broad concentration range including physiological picomolar levels.',
    },
  ],

  'igf-1-lr3': [
    {
      title: 'Long R3 Insulin-Like Growth Factor-I (IGF-I) Infusion Stimulates Organ Growth But Reduces Plasma IGF-I, IGF-II and IGF Binding Protein Concentrations',
      authors: 'Conlon MA, Tomas FM, Owens PC, et al.',
      journal: 'Journal of Endocrinology',
      year: 1995,
      pmid: '7561636',
      url: 'https://pubmed.ncbi.nlm.nih.gov/7561636/',
      summary: 'Characterises Long R3 IGF-1 infusion effects on the endocrine axis in guinea pig models, confirming reduced binding protein sequestration compared to native IGF-1.',
    },
    {
      title: 'Long [R3] Insulin-Like Growth Factor-I Reduces Growth, Plasma Growth Hormone, IGF Binding Protein-3 and Endogenous IGF-I Concentrations in Pigs',
      authors: 'Dunaiski V, Belford DA.',
      journal: 'Journal of Endocrinology',
      year: 1997,
      pmid: '9488001',
      url: 'https://pubmed.ncbi.nlm.nih.gov/9488001/',
      summary: 'In vivo large animal study characterising the systemic effects of Long R3 IGF-1 administration on the endogenous GH/IGF-1 axis and IGF binding protein regulation.',
    },
    {
      title: 'Insulin-Like Growth Factor-I (IGF-I) and Especially IGF-I Variants in Dexamethasone-Treated Rats',
      authors: 'Tomas FM, Knowles SE, Owens PC, et al.',
      journal: 'Biochemical Journal',
      year: 1992,
      pmid: '1371669',
      doi: '10.1042/bj2820091',
      url: 'https://pubmed.ncbi.nlm.nih.gov/1371669/',
      summary: 'Foundational study describing the Long R3 IGF-1 analogue and documenting its dramatically reduced IGFBP binding affinity compared to native IGF-1, establishing the pharmacokinetic rationale for the LR3 modification.',
    },
  ],

  'lp-sm': [],

  'sermorelin': [],

  'melanotan-2': [
    {
      title: 'The Melanocortin Agonist, Melanotan II, Enhances Proceptive Sexual Behaviors in the Female Rat',
      authors: 'Rössler AS, Pfaus JG, Kia HK, et al.',
      journal: 'Pharmacology Biochemistry and Behavior',
      year: 2006,
      pmid: '17113634',
      doi: '10.1016/j.pbb.2006.09.023',
      url: 'https://pubmed.ncbi.nlm.nih.gov/17113634/',
      summary: 'Characterises Melanotan II-induced central melanocortin receptor activation in female rat models, documenting dose-dependent CNS-mediated behavioural responses via MC4R pathway engagement.',
    },
  ],

  'pt-141': [],
}
