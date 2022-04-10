var struct_data = [
    {"HTV": [
        {
            "title": "Metadata attribute",
            "select":{
                "BMI": "BMI_pie",
                "age": "age_pie",
                "sex": "sex_pie",
                "country": "country_pie",
                "phenotype": "phenotype_pie"
            }
        }]
    },
    
    {"HV": [
        {
            "title": "Phenotype (MeSH ID)",
            "select":{
                "D000236(Adenoma)": "D000236",
                "D001172(Arthritis, Rheumatoid)": "D001172",
                "D001528(Behcet Syndrome)": "D001528",
                "D001943(Breast Neoplasms)": "D001943",
                "D003093(Colitis, Ulcerative)": "D003093",
                "D003424(Crohn Disease)": "D003424",
                "D003922(Diabetes Mellitus, Type 1)": "D003922",
                "D003922(Diabetes Mellitus, Type 2)": "D003924",
                "D006973(Hypertension)": "D006973",
                "D007234(Infant, Premature)": "D007234",
                "D008545(Melanoma)": "D008545",
                "D009765(Obesity)": "D009765",
                "D011236(Prediabetic State)": "D011236",
                "D012778(Short Bowel Syndrome)": "D012778",
                "D013167(Spondylitis, Ankylosing)": "D013167",
                "D014376(Tuberculosis)": "D014376",
                "D014607(Uveomeningoencephalitic Syndrome)": "D014607",
                "D015179(Colorectal Neoplasms)": "D015179",
                "D015212(Inflammatory Bowel Diseases)": "D015212",
                "D016640(Diabetes, Gestational)": "D016640",
                "D037841(Pregnant Women)": "D037841",
                "D050177(Overweight)": "D050177",
                "D065626(Non-alcoholic Fatty Liver Disease)": "D065626"
            }
        }]

    },

    {"HV": [
        {
            "title": "Phenotype (MeSH ID)",
            "select":{
                "D000236(Adenoma)": "D000236", 
                "D001172(Arthritis, Rheumatoid)": "D001172", 
                "D001528(Behcet Syndrome)": "D001528", 
                "D001943(Breast Neoplasms)": "D001943", 
                "D003093(Colitis, Ulcerative)": "D003093", 
                "D003424(Crohn Disease)": "D003424", 
                "D003922(Diabetes Mellitus, Type 1)": "D003922", 
                "D003924(Diabetes Mellitus, Type 2)": "D003924", 
                "D006973(Hypertension)": "D006973", 
                "D007234(Infant, Premature)": "D007234", 
                "D008545(Melanoma)": "D008545", 
                "D009765(Obesity)": "D009765", 
                "D011236(Prediabetic State)": "D011236", 
                "D012778(Short Bowel Syndrome)": "D012778", 
                "D013167(Spondylitis, Ankylosing)": "D013167", 
                "D014376(Tuberculosis)": "D014376", 
                "D014607(Uveomeningoencephalitic Syndrome)": "D014607", 
                "D015179(Colorectal Neoplasms)": "D015179", 
                "D015212(Inflammatory Bowel Diseases)": "D015212", 
                "D016640(Diabetes, Gestational)": "D016640", 
                "D037841(Pregnant Women)": "D037841", 
                "D050177(Overweight)": "D050177", 
                "D065626(Non-alcoholic Fatty Liver Disease)": "D065626"
            }

        },
        {   "title":"Taxonomy level",
            "select":{
                "Phylum": "p",
                "Class": "c",
                "Order": "o",
                "Family": "f",
                "Genus": "g",
                "Species": "s"
            }
            
        }]
    }
];

var head_relation = {
    "pie": "pie",
    "boxplot": "boxplot",
    "tree": "tree"
};

var table_relation = {
    "BMI_pie": "BMI",
    "age_pie": "age",
    "sex_pie": "sex",
    "country_pie": "country",
    "phenotype_pie": "phenotype"
};

var viz_relation = {
    "BMI_pie": "dn1",
    "age_pie": "dn2",
    "sex_pie": "dn3",
    "country_pie": "dn4",
    "phenotype_pie": "dn5",
    "D000236": "D000236",
    "D001172": "D001172",
    "D001528": "D001528",
    "D001943": "D001943",
    "D003093": "D003093",
    "D003424": "D003424",
    "D003922": "D003922",
    "D003924": "D003924",
    "D006973": "D006973",
    "D007234": "D007234",
    "D008545": "D008545",
    "D009765": "D009765",
    "D011236": "D011236",
    "D012778": "D012778",
    "D013167": "D013167",
    "D014376": "D014376",
    "D014607": "D014607",
    "D015179": "D015179",
    "D015212": "D015212",
    "D016640": "D016640",
    "D037841": "D037841",
    "D050177": "D050177",
    "D065626": "D065626",
    "D000236_c": "box_D000236_c",
    "D001172_c": "box_D001172_c",
    "D001528_c": "box_D001528_c",
    "D001943_c": "box_D001943_c",
    "D003093_c": "box_D003093_c",
    "D003424_c": "box_D003424_c",
    "D003922_c": "box_D003922_c",
    "D003924_c": "box_D003924_c",
    "D006973_c": "box_D006973_c",
    "D007234_c": "box_D007234_c",
    "D008545_c": "box_D008545_c",
    "D009765_c": "box_D009765_c",
    "D011236_c": "box_D011236_c",
    "D012778_c": "box_D012778_c",
    "D013167_c": "box_D013167_c",
    "D014376_c": "box_D014376_c",
    "D014607_c": "box_D014607_c",
    "D015179_c": "box_D015179_c",
    "D015212_c": "box_D015212_c",
    "D016640_c": "box_D016640_c",
    "D037841_c": "box_D037841_c",
    "D050177_c": "box_D050177_c",
    "D065626_c": "box_D065626_c",
    "D000236_f": "box_D000236_f",
    "D001172_f": "box_D001172_f",
    "D001528_f": "box_D001528_f",
    "D001943_f": "box_D001943_f",
    "D003093_f": "box_D003093_f",
    "D003424_f": "box_D003424_f",
    "D003922_f": "box_D003922_f",
    "D003924_f": "box_D003924_f",
    "D006973_f": "box_D006973_f",
    "D007234_f": "box_D007234_f",
    "D008545_f": "box_D008545_f",
    "D009765_f": "box_D009765_f",
    "D011236_f": "box_D011236_f",
    "D012778_f": "box_D012778_f",
    "D013167_f": "box_D013167_f",
    "D014376_f": "box_D014376_f",
    "D014607_f": "box_D014607_f",
    "D015179_f": "box_D015179_f",
    "D015212_f": "box_D015212_f",
    "D016640_f": "box_D016640_f",
    "D037841_f": "box_D037841_f",
    "D050177_f": "box_D050177_f",
    "D065626_f": "box_D065626_f",
    "D000236_g": "box_D000236_g",
    "D001172_g": "box_D001172_g",
    "D001528_g": "box_D001528_g",
    "D001943_g": "box_D001943_g",
    "D003093_g": "box_D003093_g",
    "D003424_g": "box_D003424_g",
    "D003922_g": "box_D003922_g",
    "D003924_g": "box_D003924_g",
    "D006973_g": "box_D006973_g",
    "D007234_g": "box_D007234_g",
    "D008545_g": "box_D008545_g",
    "D009765_g": "box_D009765_g",
    "D011236_g": "box_D011236_g",
    "D012778_g": "box_D012778_g",
    "D013167_g": "box_D013167_g",
    "D014376_g": "box_D014376_g",
    "D014607_g": "box_D014607_g",
    "D015179_g": "box_D015179_g",
    "D015212_g": "box_D015212_g",
    "D016640_g": "box_D016640_g",
    "D037841_g": "box_D037841_g",
    "D050177_g": "box_D050177_g",
    "D065626_g": "box_D065626_g",
    "D000236_o": "box_D000236_o",
    "D001172_o": "box_D001172_o",
    "D001528_o": "box_D001528_o",
    "D001943_o": "box_D001943_o",
    "D003093_o": "box_D003093_o",
    "D003424_o": "box_D003424_o",
    "D003922_o": "box_D003922_o",
    "D003924_o": "box_D003924_o",
    "D006973_o": "box_D006973_o",
    "D007234_o": "box_D007234_o",
    "D008545_o": "box_D008545_o",
    "D009765_o": "box_D009765_o",
    "D011236_o": "box_D011236_o",
    "D012778_o": "box_D012778_o",
    "D013167_o": "box_D013167_o",
    "D014376_o": "box_D014376_o",
    "D014607_o": "box_D014607_o",
    "D015179_o": "box_D015179_o",
    "D015212_o": "box_D015212_o",
    "D016640_o": "box_D016640_o",
    "D037841_o": "box_D037841_o",
    "D050177_o": "box_D050177_o",
    "D065626_o": "box_D065626_o",
    "D000236_p": "box_D000236_p",
    "D001172_p": "box_D001172_p",
    "D001528_p": "box_D001528_p",
    "D001943_p": "box_D001943_p",
    "D003093_p": "box_D003093_p",
    "D003424_p": "box_D003424_p",
    "D003922_p": "box_D003922_p",
    "D003924_p": "box_D003924_p",
    "D006973_p": "box_D006973_p",
    "D007234_p": "box_D007234_p",
    "D008545_p": "box_D008545_p",
    "D009765_p": "box_D009765_p",
    "D011236_p": "box_D011236_p",
    "D012778_p": "box_D012778_p",
    "D013167_p": "box_D013167_p",
    "D014376_p": "box_D014376_p",
    "D014607_p": "box_D014607_p",
    "D015179_p": "box_D015179_p",
    "D015212_p": "box_D015212_p",
    "D016640_p": "box_D016640_p",
    "D037841_p": "box_D037841_p",
    "D050177_p": "box_D050177_p",
    "D065626_p": "box_D065626_p",
    "D000236_s": "box_D000236_s",
    "D001172_s": "box_D001172_s",
    "D001528_s": "box_D001528_s",
    "D001943_s": "box_D001943_s",
    "D003093_s": "box_D003093_s",
    "D003424_s": "box_D003424_s",
    "D003922_s": "box_D003922_s",
    "D003924_s": "box_D003924_s",
    "D006973_s": "box_D006973_s",
    "D007234_s": "box_D007234_s",
    "D008545_s": "box_D008545_s",
    "D009765_s": "box_D009765_s",
    "D011236_s": "box_D011236_s",
    "D012778_s": "box_D012778_s",
    "D013167_s": "box_D013167_s",
    "D014376_s": "box_D014376_s",
    "D014607_s": "box_D014607_s",
    "D015179_s": "box_D015179_s",
    "D015212_s": "box_D015212_s",
    "D016640_s": "box_D016640_s",
    "D037841_s": "box_D037841_s",
    "D050177_s": "box_D050177_s",
    "D065626_s": "box_D065626_s"
};

var text_relation = {

};

var des_data = {
    "pie": "<h2> Sample metadata statistic </h2>",
    "boxplot": "<h2> Diseases related taxonomy details</h2>",
    "tree": "<h2> Diseases related taxonomy overview </h2>",

};

var viz_data = {
    "dn1" : {
        "type": "donghnut",
        "file": ["/data/static_viz_data/pie_HMGDB_bmi_class.tsv"],
        "config": {"title": "BMI distribution", "xlabel": "BMI", "ylabel": "number"}
    },
    "dn2": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/pie_HMGDB_age_class.tsv"],
        "config": {"title": "age distribution", "xlabel": "age", "ylabel": "number"}
    },
    "dn3": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/pie_GMREPO_sex.tsv"],
        "config": {"title": "sex distribution", "xlabel": "sex", "ylabel": "number"}
    },
    "dn4": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/pie_GMREPO_country.tsv"],
        "config": {"title": "samples in different country", "xlabel": "country", "ylabel": "number"}
    },
    "dn5": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/pie_GMREPO_phenotype_v.tsv"],
        "config": {"title": "phenotype distribution", "xlabel": "phenotype", "ylabel": "number"}
    },
    "D000236": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D000236_anno.tsv", "matrix":"/data/static_viz_data/tree_D000236_test.tsv", "tree":"/data/static_viz_data/tree_D000236_abd.tsv"},
        "config": {}
    },
    "D001172": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D001172_anno.tsv", "matrix":"/data/static_viz_data/tree_D001172_test.tsv", "tree":"/data/static_viz_data/tree_D001172_abd.tsv"},
        "config": {}
    },
    "D001528": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D001528_anno.tsv", "matrix":"/data/static_viz_data/tree_D001528_test.tsv", "tree":"/data/static_viz_data/tree_D001528_abd.tsv"},
        "config": {}
    },
    "D001943": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D001943_anno.tsv", "matrix":"/data/static_viz_data/tree_D001943_test.tsv", "tree":"/data/static_viz_data/tree_D001943_abd.tsv"},
        "config": {}
    },
    "D003093": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D003093_anno.tsv", "matrix":"/data/static_viz_data/tree_D003093_test.tsv", "tree":"/data/static_viz_data/tree_D003093_abd.tsv"},
        "config": {}
    },
    "D003424": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D003424_anno.tsv", "matrix":"/data/static_viz_data/tree_D003424_test.tsv", "tree":"/data/static_viz_data/tree_D003424_abd.tsv"},
        "config": {}
    },
    "D003922": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D003922_anno.tsv", "matrix":"/data/static_viz_data/tree_D003922_test.tsv", "tree":"/data/static_viz_data/tree_D003922_abd.tsv"},
        "config": {}
    },
    "D003924": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D003924_anno.tsv", "matrix":"/data/static_viz_data/tree_D003924_test.tsv", "tree":"/data/static_viz_data/tree_D003924_abd.tsv"},
        "config": {}
    },
    "D006973": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D006973_anno.tsv", "matrix":"/data/static_viz_data/tree_D006973_test.tsv", "tree":"/data/static_viz_data/tree_D006973_abd.tsv"},
        "config": {}
    },
    "D007234": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D007234_anno.tsv", "matrix":"/data/static_viz_data/tree_D007234_test.tsv", "tree":"/data/static_viz_data/tree_D007234_abd.tsv"},
        "config": {}
    },
    "D008545": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D008545_anno.tsv", "matrix":"/data/static_viz_data/tree_D008545_test.tsv", "tree":"/data/static_viz_data/tree_D008545_abd.tsv"},
        "config": {}
    },
    "D009765": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D009765_anno.tsv", "matrix":"/data/static_viz_data/tree_D009765_test.tsv", "tree":"/data/static_viz_data/tree_D009765_abd.tsv"},
        "config": {}
    },
    "D011236": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D011236_anno.tsv", "matrix":"/data/static_viz_data/tree_D011236_test.tsv", "tree":"/data/static_viz_data/tree_D011236_abd.tsv"},
        "config": {}
    },
    "D012778": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D012778_anno.tsv", "matrix":"/data/static_viz_data/tree_D012778_test.tsv", "tree":"/data/static_viz_data/tree_D012778_abd.tsv"},
        "config": {}
    },
    "D013167": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D013167_anno.tsv", "matrix":"/data/static_viz_data/tree_D013167_test.tsv", "tree":"/data/static_viz_data/tree_D013167_abd.tsv"},
        "config": {}
    },
    "D014376": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D014376_anno.tsv", "matrix":"/data/static_viz_data/tree_D014376_test.tsv", "tree":"/data/static_viz_data/tree_D014376_abd.tsv"},
        "config": {}
    },
    "D014607": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D014607_anno.tsv", "matrix":"/data/static_viz_data/tree_D014607_test.tsv", "tree":"/data/static_viz_data/tree_D014607_abd.tsv"},
        "config": {}
    },
    "D015179": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D015179_anno.tsv", "matrix":"/data/static_viz_data/tree_D015179_test.tsv", "tree":"/data/static_viz_data/tree_D015179_abd.tsv"},
        "config": {}
    },
    "D015212": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D015212_anno.tsv", "matrix":"/data/static_viz_data/tree_D015212_test.tsv", "tree":"/data/static_viz_data/tree_D015212_abd.tsv"},
        "config": {}
    },
    "D016640": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D016640_anno.tsv", "matrix":"/data/static_viz_data/tree_D016640_test.tsv", "tree":"/data/static_viz_data/tree_D016640_abd.tsv"},
        "config": {}
    },
    "D037841": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D037841_anno.tsv", "matrix":"/data/static_viz_data/tree_D037841_test.tsv", "tree":"/data/static_viz_data/tree_D037841_abd.tsv"},
        "config": {}
    },
    "D050177": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D050177_anno.tsv", "matrix":"/data/static_viz_data/tree_D050177_test.tsv", "tree":"/data/static_viz_data/tree_D050177_abd.tsv"},
        "config": {}
    },
    "D065626": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D065626_anno.tsv", "matrix":"/data/static_viz_data/tree_D065626_test.tsv", "tree":"/data/static_viz_data/tree_D065626_abd.tsv"},
        "config": {}
    },
    "box_D000236_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D000236_c.tsv"], "config":  {} }, 
    "box_D001172_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001172_c.tsv"], "config":  {} }, 
    "box_D001528_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001528_c.tsv"], "config":  {} }, 
    "box_D001943_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001943_c.tsv"], "config":  {} }, 
    "box_D003093_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003093_c.tsv"], "config":  {} }, 
    "box_D003424_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003424_c.tsv"], "config":  {} }, 
    "box_D003922_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003922_c.tsv"], "config":  {} }, 
    "box_D003924_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003924_c.tsv"], "config":  {} }, 
    "box_D006973_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D006973_c.tsv"], "config":  {} }, 
    "box_D007234_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D007234_c.tsv"], "config":  {} }, 
    "box_D008545_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D008545_c.tsv"], "config":  {} }, 
    "box_D009765_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D009765_c.tsv"], "config":  {} }, 
    "box_D011236_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D011236_c.tsv"], "config":  {} }, 
    "box_D012778_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D012778_c.tsv"], "config":  {} }, 
    "box_D013167_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D013167_c.tsv"], "config":  {} }, 
    "box_D014376_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014376_c.tsv"], "config":  {} }, 
    "box_D014607_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014607_c.tsv"], "config":  {} }, 
    "box_D015179_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015179_c.tsv"], "config":  {} }, 
    "box_D015212_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015212_c.tsv"], "config":  {} }, 
    "box_D016640_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D016640_c.tsv"], "config":  {} }, 
    "box_D037841_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D037841_c.tsv"], "config":  {} }, 
    "box_D050177_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D050177_c.tsv"], "config":  {} }, 
    "box_D065626_c": { "type": "boxplot", "file": ["/data/static_viz_data/box_D065626_c.tsv"], "config":  {} }, 
    "box_D000236_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D000236_f.tsv"], "config":  {} }, 
    "box_D001172_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001172_f.tsv"], "config":  {} }, 
    "box_D001528_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001528_f.tsv"], "config":  {} }, 
    "box_D001943_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001943_f.tsv"], "config":  {} }, 
    "box_D003093_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003093_f.tsv"], "config":  {} }, 
    "box_D003424_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003424_f.tsv"], "config":  {} }, 
    "box_D003922_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003922_f.tsv"], "config":  {} }, 
    "box_D003924_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003924_f.tsv"], "config":  {} }, 
    "box_D006973_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D006973_f.tsv"], "config":  {} }, 
    "box_D007234_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D007234_f.tsv"], "config":  {} }, 
    "box_D008545_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D008545_f.tsv"], "config":  {} }, 
    "box_D009765_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D009765_f.tsv"], "config":  {} }, 
    "box_D011236_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D011236_f.tsv"], "config":  {} }, 
    "box_D012778_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D012778_f.tsv"], "config":  {} }, 
    "box_D013167_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D013167_f.tsv"], "config":  {} }, 
    "box_D014376_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014376_f.tsv"], "config":  {} }, 
    "box_D014607_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014607_f.tsv"], "config":  {} }, 
    "box_D015179_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015179_f.tsv"], "config":  {} }, 
    "box_D015212_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015212_f.tsv"], "config":  {} }, 
    "box_D016640_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D016640_f.tsv"], "config":  {} }, 
    "box_D037841_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D037841_f.tsv"], "config":  {} }, 
    "box_D050177_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D050177_f.tsv"], "config":  {} }, 
    "box_D065626_f": { "type": "boxplot", "file": ["/data/static_viz_data/box_D065626_f.tsv"], "config":  {} }, 
    "box_D000236_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D000236_g.tsv"], "config":  {} }, 
    "box_D001172_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001172_g.tsv"], "config":  {} }, 
    "box_D001528_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001528_g.tsv"], "config":  {} }, 
    "box_D001943_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001943_g.tsv"], "config":  {} }, 
    "box_D003093_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003093_g.tsv"], "config":  {} }, 
    "box_D003424_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003424_g.tsv"], "config":  {} }, 
    "box_D003922_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003922_g.tsv"], "config":  {} }, 
    "box_D003924_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003924_g.tsv"], "config":  {} }, 
    "box_D006973_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D006973_g.tsv"], "config":  {} }, 
    "box_D007234_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D007234_g.tsv"], "config":  {} }, 
    "box_D008545_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D008545_g.tsv"], "config":  {} }, 
    "box_D009765_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D009765_g.tsv"], "config":  {} }, 
    "box_D011236_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D011236_g.tsv"], "config":  {} }, 
    "box_D012778_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D012778_g.tsv"], "config":  {} }, 
    "box_D013167_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D013167_g.tsv"], "config":  {} }, 
    "box_D014376_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014376_g.tsv"], "config":  {} }, 
    "box_D014607_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014607_g.tsv"], "config":  {} }, 
    "box_D015179_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015179_g.tsv"], "config":  {} }, 
    "box_D015212_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015212_g.tsv"], "config":  {} }, 
    "box_D016640_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D016640_g.tsv"], "config":  {} }, 
    "box_D037841_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D037841_g.tsv"], "config":  {} }, 
    "box_D050177_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D050177_g.tsv"], "config":  {} }, 
    "box_D065626_g": { "type": "boxplot", "file": ["/data/static_viz_data/box_D065626_g.tsv"], "config":  {} }, 
    "box_D000236_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D000236_o.tsv"], "config":  {} }, 
    "box_D001172_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001172_o.tsv"], "config":  {} }, 
    "box_D001528_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001528_o.tsv"], "config":  {} }, 
    "box_D001943_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001943_o.tsv"], "config":  {} }, 
    "box_D003093_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003093_o.tsv"], "config":  {} }, 
    "box_D003424_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003424_o.tsv"], "config":  {} }, 
    "box_D003922_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003922_o.tsv"], "config":  {} }, 
    "box_D003924_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003924_o.tsv"], "config":  {} }, 
    "box_D006973_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D006973_o.tsv"], "config":  {} }, 
    "box_D007234_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D007234_o.tsv"], "config":  {} }, 
    "box_D008545_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D008545_o.tsv"], "config":  {} }, 
    "box_D009765_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D009765_o.tsv"], "config":  {} }, 
    "box_D011236_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D011236_o.tsv"], "config":  {} }, 
    "box_D012778_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D012778_o.tsv"], "config":  {} }, 
    "box_D013167_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D013167_o.tsv"], "config":  {} }, 
    "box_D014376_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014376_o.tsv"], "config":  {} }, 
    "box_D014607_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014607_o.tsv"], "config":  {} }, 
    "box_D015179_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015179_o.tsv"], "config":  {} }, 
    "box_D015212_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015212_o.tsv"], "config":  {} }, 
    "box_D016640_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D016640_o.tsv"], "config":  {} }, 
    "box_D037841_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D037841_o.tsv"], "config":  {} }, 
    "box_D050177_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D050177_o.tsv"], "config":  {} }, 
    "box_D065626_o": { "type": "boxplot", "file": ["/data/static_viz_data/box_D065626_o.tsv"], "config":  {} }, 
    "box_D000236_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D000236_p.tsv"], "config":  {} }, 
    "box_D001172_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001172_p.tsv"], "config":  {} }, 
    "box_D001528_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001528_p.tsv"], "config":  {} }, 
    "box_D001943_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001943_p.tsv"], "config":  {} }, 
    "box_D003093_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003093_p.tsv"], "config":  {} }, 
    "box_D003424_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003424_p.tsv"], "config":  {} }, 
    "box_D003922_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003922_p.tsv"], "config":  {} }, 
    "box_D003924_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003924_p.tsv"], "config":  {} }, 
    "box_D006973_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D006973_p.tsv"], "config":  {} }, 
    "box_D007234_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D007234_p.tsv"], "config":  {} }, 
    "box_D008545_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D008545_p.tsv"], "config":  {} }, 
    "box_D009765_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D009765_p.tsv"], "config":  {} }, 
    "box_D011236_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D011236_p.tsv"], "config":  {} }, 
    "box_D012778_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D012778_p.tsv"], "config":  {} }, 
    "box_D013167_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D013167_p.tsv"], "config":  {} }, 
    "box_D014376_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014376_p.tsv"], "config":  {} }, 
    "box_D014607_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014607_p.tsv"], "config":  {} }, 
    "box_D015179_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015179_p.tsv"], "config":  {} }, 
    "box_D015212_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015212_p.tsv"], "config":  {} }, 
    "box_D016640_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D016640_p.tsv"], "config":  {} }, 
    "box_D037841_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D037841_p.tsv"], "config":  {} }, 
    "box_D050177_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D050177_p.tsv"], "config":  {} }, 
    "box_D065626_p": { "type": "boxplot", "file": ["/data/static_viz_data/box_D065626_p.tsv"], "config":  {} }, 
    "box_D000236_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D000236_s.tsv"], "config":  {} }, 
    "box_D001172_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001172_s.tsv"], "config":  {} }, 
    "box_D001528_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001528_s.tsv"], "config":  {} }, 
    "box_D001943_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D001943_s.tsv"], "config":  {} }, 
    "box_D003093_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003093_s.tsv"], "config":  {} }, 
    "box_D003424_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003424_s.tsv"], "config":  {} }, 
    "box_D003922_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003922_s.tsv"], "config":  {} }, 
    "box_D003924_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D003924_s.tsv"], "config":  {} }, 
    "box_D006973_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D006973_s.tsv"], "config":  {} }, 
    "box_D007234_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D007234_s.tsv"], "config":  {} }, 
    "box_D008545_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D008545_s.tsv"], "config":  {} }, 
    "box_D009765_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D009765_s.tsv"], "config":  {} }, 
    "box_D011236_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D011236_s.tsv"], "config":  {} }, 
    "box_D012778_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D012778_s.tsv"], "config":  {} }, 
    "box_D013167_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D013167_s.tsv"], "config":  {} }, 
    "box_D014376_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014376_s.tsv"], "config":  {} }, 
    "box_D014607_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D014607_s.tsv"], "config":  {} }, 
    "box_D015179_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015179_s.tsv"], "config":  {} }, 
    "box_D015212_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D015212_s.tsv"], "config":  {} }, 
    "box_D016640_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D016640_s.tsv"], "config":  {} }, 
    "box_D037841_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D037841_s.tsv"], "config":  {} }, 
    "box_D050177_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D050177_s.tsv"], "config":  {} }, 
    "box_D065626_s": { "type": "boxplot", "file": ["/data/static_viz_data/box_D065626_s.tsv"], "config":  {} }, 
};

var text_data = {

};

var table_data = window.gon.table_data;


var init_data = {
    "T0B0": "BMI_pie",
    "V1B0": "BMI_pie",
    "V0B1": "D000236",
    "V0B2": "D000236_p",
    "HB0": "pie",
    "HB1": "tree",
    "HB2": "boxplot"
};

var relation_data = {
    "v": viz_relation,
    "t": table_relation,
    "x": text_relation,
    "h": head_relation
};

var content_data = {
    "v": viz_data,
    "t": table_data,
    "x": text_data,
    "h": des_data
}

export var data = {
    "struct": struct_data,
    "init": init_data,
    "relation": relation_data,
    "content": content_data
}
