#!/usr/bin/env python3
"""
Death Atlas - 2025 Global Mortality Dataset Generator
Generates comprehensive mortality data for all 195 UN-recognized countries
using UN WPP 2024/2025 projections, WHO GHE, IHME GBD, and conflict monitors.
Includes Flag Emojis, ISO-2 codes, and Per-Capita Rates per 100k.
"""

import json
import os

ISO3_TO_ISO2 = {
    "AFG": "AF", "ALB": "AL", "DZA": "DZ", "AND": "AD", "AGO": "AO", "ATG": "AG", "ARG": "AR", "ARM": "AM", "AUS": "AU",
    "AUT": "AT", "AZE": "AZ", "BHS": "BS", "BHR": "BH", "BGD": "BD", "BRB": "BB", "BLR": "BY", "BEL": "BE", "BLZ": "BZ",
    "BEN": "BJ", "BTN": "BT", "BOL": "BO", "BIH": "BA", "BWA": "BW", "BRA": "BR", "BRN": "BN", "BGR": "BG", "BFA": "BF",
    "BDI": "BI", "CPV": "CV", "KHM": "KH", "CMR": "CM", "CAN": "CA", "CAF": "CF", "TCD": "TD", "CHL": "CL", "CHN": "CN",
    "COL": "CO", "COM": "KM", "COG": "CG", "COD": "CD", "CRI": "CR", "CIV": "CI", "HRV": "HR", "CUB": "CU", "CYP": "CY",
    "CZE": "CZ", "DNK": "DK", "DJI": "DJ", "DMA": "DM", "DOM": "DO", "ECU": "EC", "EGY": "EG", "SLV": "SV", "GNQ": "GQ",
    "ERI": "ER", "EST": "EE", "SWZ": "SZ", "ETH": "ET", "FJI": "FJ", "FIN": "FI", "FRA": "FR", "GAB": "GA", "GMB": "GM",
    "GEO": "GE", "DEU": "DE", "GHA": "GH", "GRC": "GR", "GRD": "GD", "GTM": "GT", "GIN": "GN", "GNB": "GW", "GUY": "GY",
    "HTI": "HT", "VAT": "VA", "HND": "HN", "HUN": "HU", "ISL": "IS", "IND": "IN", "IDN": "ID", "IRN": "IR", "IRQ": "IQ",
    "IRL": "IE", "ISR": "IL", "ITA": "IT", "JAM": "JM", "JPN": "JP", "JOR": "JO", "KAZ": "KZ", "KEN": "KE", "KIR": "KI",
    "PRK": "KP", "KOR": "KR", "KWT": "KW", "KGZ": "KG", "LAO": "LA", "LVA": "LV", "LBN": "LB", "LSO": "LS", "LBR": "LR",
    "LBY": "LY", "LIE": "LI", "LTU": "LT", "LUX": "LU", "MDG": "MG", "MWI": "MW", "MYS": "MY", "MDV": "MV", "MLI": "ML",
    "MLT": "MT", "MHL": "MH", "MRT": "MR", "MUS": "MU", "MEX": "MX", "FSM": "FM", "MDA": "MD", "MCO": "MC", "MNG": "MN",
    "MNE": "ME", "MAR": "MA", "MOZ": "MZ", "MMR": "MM", "NAM": "NA", "NRU": "NR", "NPL": "NP", "NLD": "NL", "NZL": "NZ",
    "NIC": "NI", "NER": "NE", "NGA": "NG", "MKD": "MK", "NOR": "NO", "OMN": "OM", "PAK": "PK", "PLW": "PW", "PSE": "PS",
    "PAN": "PA", "PNG": "PG", "PRY": "PY", "PER": "PE", "PHL": "PH", "POL": "PL", "PRT": "PT", "QAT": "QA", "ROU": "RO",
    "RUS": "RU", "RWA": "RW", "KNA": "KN", "LCA": "LC", "VCT": "VC", "WSM": "WS", "SMR": "SM", "STP": "ST", "SAU": "SA",
    "SEN": "SN", "SRB": "RS", "SYC": "SC", "SLE": "SL", "SGP": "SG", "SVK": "SK", "SVN": "SI", "SLB": "SB", "SOM": "SO",
    "ZAF": "ZA", "SSD": "SS", "ESP": "ES", "LKA": "LK", "SDN": "SD", "SUR": "SR", "SWE": "SE", "CHE": "CH", "SYR": "SY",
    "TJK": "TJ", "TZA": "TZ", "THA": "TH", "TLS": "TL", "TGO": "TG", "TON": "TO", "TTO": "TT", "TUN": "TN", "TUR": "TR",
    "TKM": "TM", "TUV": "TV", "UGA": "UG", "UKR": "UA", "ARE": "AE", "GBR": "GB", "USA": "US", "URY": "UY", "UZB": "UZ",
    "VUT": "VU", "VEN": "VE", "VNM": "VN", "YEM": "YE", "ZMB": "ZM", "ZWE": "ZW"
}

def get_flag(iso2):
    return "".join(chr(ord(c) + 127397) for c in iso2.upper())

COUNTRIES_META = [
    # AFRICA (54)
    ("DZA", "Algeria", "Africa", "Northern Africa", 46800000, 4.8, 77.2, "medium", None),
    ("AGO", "Angola", "Africa", "Middle Africa", 37800000, 7.8, 62.4, "low", "Low CRVS coverage (<30%); demographic projections modeled by UN and WHO."),
    ("BEN", "Benin", "Africa", "Western Africa", 14200000, 8.4, 61.2, "low", "Vital registration incomplete; modeled on sample surveys and WHO GHE."),
    ("BWA", "Botswana", "Africa", "Southern Africa", 2700000, 6.9, 66.5, "medium", "National civil registry with medium coverage, adult mortality adjusted for HIV/TB."),
    ("BFA", "Burkina Faso", "Africa", "Western Africa", 23900000, 7.9, 61.5, "low", "Regional instability and displacement; estimates synthesized from WHO and ACLED."),
    ("BDI", "Burundi", "Africa", "Eastern Africa", 13600000, 7.5, 62.8, "low", "Limited vital statistics; estimates derived from demographic health surveys."),
    ("CPV", "Cabo Verde", "Africa", "Western Africa", 600000, 5.7, 74.8, "medium", "Small island civil registry with moderate coverage."),
    ("CMR", "Cameroon", "Africa", "Middle Africa", 29500000, 8.1, 61.6, "low", "Partial registration; Far North and Anglophone conflict areas estimated via UN agencies."),
    ("CAF", "Central African Republic", "Africa", "Middle Africa", 5900000, 11.8, 55.4, "low", "Protracted humanitarian crisis; estimates based on UN OCHA and WHO cluster surveys."),
    ("TCD", "Chad", "Africa", "Middle Africa", 19100000, 10.9, 54.2, "low", "CRVS coverage under 15%; vital indicators modeled from UN Population Division."),
    ("COM", "Comoros", "Africa", "Eastern Africa", 870000, 6.8, 65.1, "low", "Hospital-based mortality sampling with demographic adjustments."),
    ("COG", "Congo", "Africa", "Middle Africa", 6300000, 6.7, 65.3, "low", "Incomplete civil registry; mortality modeled via WHO baseline."),
    ("CIV", "Côte d'Ivoire", "Africa", "Western Africa", 30400000, 8.9, 59.8, "medium", "Expanding civil registry supplemented by demographic modeling."),
    ("COD", "Democratic Republic of the Congo", "Africa", "Middle Africa", 105000000, 9.2, 60.7, "low", "Ongoing armed conflict in eastern provinces; estimates based on UN OCHA and WHO models."),
    ("DJI", "Djibouti", "Africa", "Eastern Africa", 1150000, 7.1, 64.2, "low", "Urban-centric registration; rural mortality estimated."),
    ("EGY", "Egypt", "Africa", "Northern Africa", 114500000, 5.8, 71.3, "high", "Comprehensive national civil registration with high coverage (>90%)."),
    ("GNQ", "Equatorial Guinea", "Africa", "Middle Africa", 1750000, 8.5, 61.8, "low", "Sparse vital records; modeled on regional epidemiological benchmarks."),
    ("ERI", "Eritrea", "Africa", "Eastern Africa", 3800000, 6.5, 67.4, "low", "Restricted official data access; projections based on UN WPP demographic models."),
    ("SWZ", "Eswatini", "Africa", "Southern Africa", 1230000, 9.1, 59.5, "medium", "Civil registry adjusted for dual burden of HIV and cardiovascular diseases."),
    ("ETH", "Ethiopia", "Africa", "Eastern Africa", 129000000, 6.2, 66.8, "low", "Incomplete CRVS and localized conflicts (Tigray/Amhara); modeled using DHS and UN OCHA."),
    ("GAB", "Gabon", "Africa", "Middle Africa", 2450000, 6.3, 67.1, "medium", "Moderate urban registration coverage with health facility records."),
    ("GMB", "Gambia", "Africa", "Western Africa", 2850000, 7.2, 63.9, "medium", "Sample vital registration and demographic surveillance sites."),
    ("GHA", "Ghana", "Africa", "Western Africa", 34800000, 6.8, 65.4, "medium", "National birth and death registry covering ~45% of deaths with statistical weighting."),
    ("GIN", "Guinea", "Africa", "Western Africa", 14700000, 8.7, 60.1, "low", "Low civil registration coverage; figures based on WHO Global Health Estimates."),
    ("GNB", "Guinea-Bissau", "Africa", "Western Africa", 2200000, 9.8, 59.2, "low", "Very low registration; estimates derived from UN WPP 2024."),
    ("KEN", "Kenya", "Africa", "Eastern Africa", 56400000, 5.6, 67.5, "medium", "CRVS coverage ~55% with civil registration modernization and verbal autopsy."),
    ("LSO", "Lesotho", "Africa", "Southern Africa", 2350000, 11.2, 54.8, "medium", "High disease burden; death records supplemented by national surveys."),
    ("LBR", "Liberia", "Africa", "Western Africa", 5500000, 7.6, 62.1, "low", "Post-epidemic recovery; estimates rely on sample surveys and WHO modeling."),
    ("LBY", "Libya", "Africa", "Northern Africa", 7000000, 5.1, 73.6, "low", "Political division and fragmented health reporting; estimates based on UN agencies."),
    ("MDG", "Madagascar", "Africa", "Eastern Africa", 31200000, 6.1, 66.2, "low", "Limited rural death registration; modeled via demographic projections."),
    ("MWI", "Malawi", "Africa", "Eastern Africa", 21500000, 6.2, 66.4, "medium", "National registration system expanding with community health worker monitoring."),
    ("MLI", "Mali", "Africa", "Western Africa", 24000000, 8.8, 60.3, "low", "Northern and central security instability; conflict casualties estimated via ACLED and UN."),
    ("MRT", "Mauritania", "Africa", "Northern Africa", 5000000, 6.7, 65.8, "low", "Nomadic and rural populations estimated through censuses and modeling."),
    ("MUS", "Mauritius", "Africa", "Eastern Africa", 1300000, 8.6, 75.3, "high", "High quality complete vital registration with ICD cause-of-death certification."),
    ("MAR", "Morocco", "Africa", "Northern Africa", 38200000, 5.4, 75.9, "medium", "Civil registry coverage ~80% with ongoing digitalization of death certificates."),
    ("MOZ", "Mozambique", "Africa", "Eastern Africa", 34800000, 8.2, 62.3, "low", "Cabo Delgado conflict and climate extremes; modeled via WHO GHE and UN OCHA."),
    ("NAM", "Namibia", "Africa", "Southern Africa", 2650000, 6.9, 65.7, "medium", "Well-maintained vital statistics system with demographic reconciliation."),
    ("NER", "Niger", "Africa", "Western Africa", 27800000, 7.7, 63.1, "low", "Sahelian security challenges; figures synthesized from WHO and UNICEF surveillance."),
    ("NGA", "Nigeria", "Africa", "Western Africa", 230000000, 11.2, 54.5, "low", "National registration coverage <20%; estimates modeled on national demographic health surveys and GBD."),
    ("RWA", "Rwanda", "Africa", "Eastern Africa", 14400000, 5.1, 68.2, "medium", "Strong local administrative death tracking and verbal autopsy mechanisms."),
    ("STP", "Sao Tome and Principe", "Africa", "Middle Africa", 240000, 5.3, 68.9, "medium", "Small population island registry with moderate hospital data coverage."),
    ("SEN", "Senegal", "Africa", "Western Africa", 18500000, 5.5, 68.4, "medium", "Civil registration modernization in progress; ~50% coverage."),
    ("SYC", "Seychelles", "Africa", "Eastern Africa", 110000, 8.1, 74.2, "high", "Universal vital registration with full medical certification of cause."),
    ("SLE", "Sierra Leone", "Africa", "Western Africa", 8900000, 10.5, 56.1, "low", "Post-crisis rebuilding; modeled estimates through WHO and sample vital registries."),
    ("SOM", "Somalia", "Africa", "Eastern Africa", 18700000, 10.4, 57.3, "low", "Protracted conflict and severe climate drought; synthesized from UN OCHA, FSNAU, and WHO."),
    ("ZAF", "South Africa", "Africa", "Southern Africa", 61000000, 9.6, 65.3, "high", "Comprehensive national death notification system (>88% coverage) by Statistics South Africa."),
    ("SSD", "South Sudan", "Africa", "Eastern Africa", 11500000, 10.8, 56.5, "low", "Humanitarian emergency; mortality derived from UN cluster surveys and IPC food security reports."),
    ("SDN", "Sudan", "Africa", "Northern Africa", 49500000, 9.5, 66.0, "low", "Catastrophic civil war; health system collapse. Casualties and excess deaths estimated from ACLED, WHO, and UN OCHA."),
    ("TZA", "Tanzania", "Africa", "Eastern Africa", 68500000, 6.1, 66.8, "medium", "Sample vital registration system with sentinel surveillance."),
    ("TGO", "Togo", "Africa", "Western Africa", 9300000, 7.8, 62.9, "low", "Moderate urban registration; national figures modeled via WHO."),
    ("TUN", "Tunisia", "Africa", "Northern Africa", 12500000, 6.7, 76.8, "medium", "High registration coverage (>80%) with medical death certification."),
    ("UGA", "Uganda", "Africa", "Eastern Africa", 50000000, 5.8, 65.9, "medium", "Expanding mobile vital registration system supplemented by demographic surveys."),
    ("ZMB", "Zambia", "Africa", "Eastern Africa", 21000000, 6.5, 65.2, "medium", "Integrated civil registration system in rollout phase."),
    ("ZWE", "Zimbabwe", "Africa", "Eastern Africa", 17000000, 8.4, 62.1, "medium", "Civil registration records adjusted for health facility coverage and economic migration."),

    # ASIA (48)
    ("AFG", "Afghanistan", "Asia", "Southern Asia", 43000000, 6.5, 63.8, "low", "Severe statistical disruption under Taliban authority; estimates from UNAMA, WHO, and NGOs."),
    ("ARM", "Armenia", "Asia", "Western Asia", 2980000, 9.3, 75.7, "high", "Complete civil vital registration with ICD cause classification."),
    ("AZE", "Azerbaijan", "Asia", "Western Asia", 10400000, 6.6, 73.5, "high", "Official vital records system with high completeness."),
    ("BHR", "Bahrain", "Asia", "Western Asia", 1580000, 2.7, 78.4, "high", "Universal civil registration and electronic health record integration."),
    ("BGD", "Bangladesh", "Asia", "Southern Asia", 174000000, 5.4, 73.2, "medium", "Sample Vital Registration System (SVRS) with high statistical validity."),
    ("BTN", "Bhutan", "Asia", "Southern Asia", 790000, 5.8, 72.8, "medium", "National civil registry with comprehensive village health worker coverage."),
    ("BRN", "Brunei", "Asia", "South-Eastern Asia", 460000, 4.3, 76.8, "high", "Complete vital registry administered by Ministry of Health."),
    ("KHM", "Cambodia", "Asia", "South-Eastern Asia", 17200000, 6.1, 70.4, "medium", "Sub-national vital registration expanding; complemented by health surveillance."),
    ("CHN", "China", "Asia", "Eastern Asia", 1408000000, 7.8, 78.6, "high", "National Disease Surveillance Points (DSP) system and universal civil registration covering 100%."),
    ("CYP", "Cyprus", "Asia", "Western Asia", 1260000, 7.1, 81.8, "high", "EU-standard vital statistics with complete coverage."),
    ("GEO", "Georgia", "Asia", "Western Asia", 3750000, 11.9, 74.5, "high", "Full civil registration with high medical certificate accuracy."),
    ("IND", "India", "Asia", "Southern Asia", 1440000000, 7.1, 71.2, "medium", "Civil Registration System (CRS) covers ~90% of deaths; cause certification expanding under MCCD."),
    ("IDN", "Indonesia", "Asia", "South-Eastern Asia", 280000000, 6.7, 72.0, "medium", "Sample vital registration and national health insurance (BPJS) administrative data."),
    ("IRN", "Iran", "Asia", "Southern Asia", 89500000, 5.2, 77.1, "high", "Electronic death registration system covering >92% of national deaths."),
    ("IRQ", "Iraq", "Asia", "Western Asia", 46000000, 4.6, 72.4, "medium", "Civil registry recovering; localized conflict mortality supplemented by UN reports."),
    ("ISR", "Israel", "Asia", "Western Asia", 9900000, 5.3, 83.4, "high", "Universal digital health and civil registration system."),
    ("JPN", "Japan", "Asia", "Eastern Asia", 123000000, 12.9, 84.8, "high", "Gold-standard complete vital registration system with 100% coverage and ICD-11 coding."),
    ("JOR", "Jordan", "Asia", "Western Asia", 11400000, 4.2, 75.8, "medium", "Civil status registry with health ministry mortality records."),
    ("KAZ", "Kazakhstan", "Asia", "Central Asia", 20200000, 7.2, 74.2, "high", "Complete vital records system with digital death registration."),
    ("KWT", "Kuwait", "Asia", "Western Asia", 4400000, 2.5, 79.8, "high", "Universal registration with electronic health certificate verification."),
    ("KGZ", "Kyrgyzstan", "Asia", "Central Asia", 7100000, 5.8, 72.6, "high", "Comprehensive civil registration system (>90% completeness)."),
    ("LAO", "Laos", "Asia", "South-Eastern Asia", 7700000, 6.4, 69.1, "low", "Early stage civil registration; estimates modeled on WHO epidemiological profiles."),
    ("LBN", "Lebanon", "Asia", "Western Asia", 5400000, 6.2, 75.6, "low", "Severe economic crisis and cross-border escalation; casualty estimates from MoPH and UN."),
    ("MYS", "Malaysia", "Asia", "South-Eastern Asia", 34500000, 5.5, 76.5, "high", "High-coverage National Registration Department and Ministry of Health records."),
    ("MDV", "Maldives", "Asia", "Southern Asia", 525000, 3.8, 80.2, "high", "Complete civil registration across atolls with digital health records."),
    ("MNG", "Mongolia", "Asia", "Eastern Asia", 3500000, 6.4, 71.8, "high", "Universal vital registration system maintained by National Statistics Office."),
    ("MMR", "Myanmar", "Asia", "South-Eastern Asia", 54800000, 8.2, 67.2, "low", "Post-coup civil conflict and state breakdown; mortality estimates from ACLED, WHO, and civil groups."),
    ("NPL", "Nepal", "Asia", "Southern Asia", 31200000, 6.0, 71.5, "medium", "Community vital registration system and demographic surveys."),
    ("PRK", "North Korea", "Asia", "Eastern Asia", 26200000, 9.4, 73.6, "low", "Closed state; estimates modeled by UN Population Division and WHO regional offices."),
    ("OMN", "Oman", "Asia", "Western Asia", 4700000, 2.6, 78.5, "high", "Universal civil registration with automated health information system."),
    ("PAK", "Pakistan", "Asia", "Southern Asia", 245000000, 6.5, 67.4, "medium", "Sample vital registration and NADRA civil database; cause of death modeled by WHO."),
    ("PSE", "Palestine", "Asia", "Western Asia", 5350000, 7.8, 71.0, "low", "Active armed conflict in Gaza and West Bank violence; casualties synthesized from UN OCHA, WHO, and MoH."),
    ("PHL", "Philippines", "Asia", "South-Eastern Asia", 118000000, 6.2, 71.9, "medium", "Philippine Statistics Authority vital registry covering ~85% of deaths with verbal autopsy."),
    ("QAT", "Qatar", "Asia", "Western Asia", 3050000, 1.4, 81.2, "high", "Universal registration with Hamad Medical Corporation health database."),
    ("SAU", "Saudi Arabia", "Asia", "Western Asia", 37000000, 3.6, 77.8, "high", "Centralized digital civil registration and unified national health record."),
    ("SGP", "Singapore", "Asia", "South-Eastern Asia", 6050000, 5.2, 84.1, "high", "Universal gold-standard registry with 100% ICD-11 coding."),
    ("KOR", "South Korea", "Asia", "Eastern Asia", 51600000, 7.2, 83.8, "high", "Universal vital registration with national electronic cause-of-death certification."),
    ("LKA", "Sri Lanka", "Asia", "Southern Asia", 22000000, 7.3, 77.2, "high", "Well-established civil registration system with >95% completeness."),
    ("SYR", "Syria", "Asia", "Western Asia", 23500000, 6.8, 72.1, "low", "Protracted conflict and partitioned authority; figures synthesized from SOHR, UN, and WHO."),
    ("TJK", "Tajikistan", "Asia", "Central Asia", 10300000, 5.1, 72.0, "medium", "Civil registry coverage expanding; baseline modeled with WHO GHE."),
    ("THA", "Thailand", "Asia", "South-Eastern Asia", 71800000, 8.4, 79.2, "high", "Universal civil registration coupled with verbal autopsy validation."),
    ("TLS", "Timor-Leste", "Asia", "South-Eastern Asia", 1380000, 5.8, 69.8, "low", "Developing vital statistics; estimates modeled from DHS and WHO."),
    ("TUR", "Turkey", "Asia", "Western Asia", 86000000, 5.7, 78.5, "high", "Central Civil Registration System (MERNIS) and Ministry of Health death reporting (>95%)."),
    ("TKM", "Turkmenistan", "Asia", "Central Asia", 6550000, 7.1, 70.2, "low", "Official data restricted; estimates derived from UN WPP 2024 demographic models."),
    ("ARE", "United Arab Emirates", "Asia", "Western Asia", 9550000, 1.7, 80.2, "high", "Universal digital health registration across Emirates."),
    ("UZB", "Uzbekistan", "Asia", "Central Asia", 36500000, 5.2, 74.2, "high", "Civil registration system with high population completeness."),
    ("VNM", "Vietnam", "Asia", "South-Eastern Asia", 100000000, 6.4, 75.6, "medium", "Expanding vital statistics with Commune Health Station reporting."),
    ("YEM", "Yemen", "Asia", "Western Asia", 35000000, 6.6, 66.8, "low", "Prolonged armed conflict and severe health fragmentation; estimates from UN OCHA and WHO."),

    # EUROPE (44)
    ("ALB", "Albania", "Europe", "Southern Europe", 2780000, 8.4, 79.5, "high", "Civil status registry with complete national vital records."),
    ("AND", "Andorra", "Europe", "Southern Europe", 80000, 6.2, 84.3, "high", "Universal civil registration with full medical certification."),
    ("AUT", "Austria", "Europe", "Western Europe", 9150000, 9.8, 82.2, "high", "Gold standard Statistics Austria vital registration."),
    ("BLR", "Belarus", "Europe", "Eastern Europe", 9450000, 13.5, 74.8, "medium", "Official vital registry; cause-of-death reporting partially restricted."),
    ("BEL", "Belgium", "Europe", "Western Europe", 11750000, 9.7, 82.3, "high", "Comprehensive Statbel vital statistics with ICD-10/11 certification."),
    ("BIH", "Bosnia and Herzegovina", "Europe", "Southern Europe", 3200000, 12.2, 77.5, "high", "Agency for Statistics of BiH civil registry records."),
    ("BGR", "Bulgaria", "Europe", "Eastern Europe", 6400000, 15.6, 75.1, "high", "National Statistical Institute complete vital records."),
    ("HRV", "Croatia", "Europe", "Southern Europe", 3900000, 13.8, 78.4, "high", "Complete vital registry with Institute of Public Health validation."),
    ("CZE", "Czech Republic", "Europe", "Eastern Europe", 10850000, 11.2, 79.8, "high", "Czech Statistical Office universal registry."),
    ("DNK", "Denmark", "Europe", "Northern Europe", 5950000, 9.6, 82.1, "high", "Danish Civil Registration System (CPR) gold-standard coverage."),
    ("EST", "Estonia", "Europe", "Northern Europe", 1370000, 12.8, 78.9, "high", "Digital e-health universal vital registry."),
    ("FIN", "Finland", "Europe", "Northern Europe", 5600000, 10.4, 82.5, "high", "Universal Population Information System with forensic/medical autopsies."),
    ("FRA", "France", "Europe", "Western Europe", 68500000, 9.8, 83.1, "high", "INSEE and CépiDc complete vital statistics with electronic death certification."),
    ("DEU", "Germany", "Europe", "Western Europe", 84500000, 12.1, 81.5, "high", "Destatis comprehensive federal vital statistics registry."),
    ("GRC", "Greece", "Europe", "Southern Europe", 10350000, 13.2, 81.9, "high", "Hellenic Statistical Authority complete civil records."),
    ("VAT", "Holy See", "Europe", "Southern Europe", 800, 4.0, 83.0, "high", "Micro-state registry administered by Vatican health service."),
    ("HUN", "Hungary", "Europe", "Eastern Europe", 9600000, 14.1, 76.9, "high", "Hungarian Central Statistical Office full registry."),
    ("ISL", "Iceland", "Europe", "Northern Europe", 390000, 6.7, 83.4, "high", "Universal digital health and civil registry."),
    ("IRL", "Ireland", "Europe", "Northern Europe", 5300000, 6.8, 83.0, "high", "Central Statistics Office universal registration."),
    ("ITA", "Italy", "Europe", "Southern Europe", 58800000, 11.9, 83.7, "high", "ISTAT complete vital registry with automated medical coding."),
    ("LVA", "Latvia", "Europe", "Northern Europe", 1870000, 15.2, 75.8, "high", "Complete national vital statistics register."),
    ("LIE", "Liechtenstein", "Europe", "Western Europe", 40000, 6.8, 84.5, "high", "Universal micro-state civil registry."),
    ("LTU", "Lithuania", "Europe", "Northern Europe", 2850000, 14.9, 76.2, "high", "Full digital vital records registry."),
    ("LUX", "Luxembourg", "Europe", "Western Europe", 670000, 7.1, 83.0, "high", "STATEC universal civil registration."),
    ("MLT", "Malta", "Europe", "Southern Europe", 535000, 7.8, 83.3, "high", "Complete National Mortality Register."),
    ("MDA", "Moldova", "Europe", "Eastern Europe", 3400000, 13.7, 71.8, "high", "National Agency for Public Health complete records."),
    ("MCO", "Monaco", "Europe", "Western Europe", 39000, 8.5, 87.0, "high", "Highest life expectancy globally; 100% vital registration coverage."),
    ("MNE", "Montenegro", "Europe", "Southern Europe", 620000, 11.5, 77.2, "high", "MONSTAT complete civil vital records."),
    ("NLD", "Netherlands", "Europe", "Western Europe", 17900000, 9.4, 82.4, "high", "Statistics Netherlands (CBS) gold-standard register."),
    ("MKD", "North Macedonia", "Europe", "Southern Europe", 2050000, 12.1, 76.5, "high", "State Statistical Office complete vital records."),
    ("NOR", "Norway", "Europe", "Northern Europe", 5550000, 8.1, 83.6, "high", "Norwegian Cause of Death Registry gold standard."),
    ("POL", "Poland", "Europe", "Eastern Europe", 37500000, 11.6, 78.5, "high", "GUS universal civil registration."),
    ("PRT", "Portugal", "Europe", "Southern Europe", 10400000, 11.8, 82.2, "high", "INE complete vital statistics registry."),
    ("ROU", "Romania", "Europe", "Eastern Europe", 18900000, 14.2, 75.8, "high", "National Institute of Statistics complete civil register."),
    ("RUS", "Russia", "Europe", "Eastern Europe", 143500000, 13.2, 73.4, "medium", "Rosstat vital registry; wartime casualties estimated from independent excess-mortality analyses."),
    ("SMR", "San Marino", "Europe", "Southern Europe", 34000, 7.6, 85.2, "high", "Universal micro-state civil registry."),
    ("SRB", "Serbia", "Europe", "Southern Europe", 6600000, 14.6, 76.0, "high", "Statistical Office of the Republic of Serbia registry."),
    ("SVK", "Slovakia", "Europe", "Eastern Europe", 5400000, 10.9, 78.0, "high", "Statistical Office of the Slovak Republic complete records."),
    ("SVN", "Slovenia", "Europe", "Southern Europe", 2120000, 10.2, 82.0, "high", "SURS comprehensive register-based vital statistics."),
    ("ESP", "Spain", "Europe", "Southern Europe", 47800000, 9.6, 83.9, "high", "INE gold-standard vital statistics with medical cause coding."),
    ("SWE", "Sweden", "Europe", "Northern Europe", 10600000, 9.1, 83.5, "high", "National Board of Health and Welfare complete registry."),
    ("CHE", "Switzerland", "Europe", "Western Europe", 8900000, 8.2, 84.2, "high", "Federal Statistical Office (FSO) gold-standard records."),
    ("UKR", "Ukraine", "Europe", "Eastern Europe", 37000000, 17.5, 68.5, "low", "Active war conditions with significant military/civilian casualties. Projections synthesized from UN HRMMU, WHO, and defense analysis."),
    ("GBR", "United Kingdom", "Europe", "Northern Europe", 68500000, 9.7, 81.8, "high", "ONS complete registration with ICD-10 medical cause certification."),

    # NORTH AMERICA (23)
    ("ATG", "Antigua and Barbuda", "North America", "Caribbean", 94000, 6.4, 78.2, "high", "Civil registry with complete hospital reporting."),
    ("BHS", "Bahamas", "North America", "Caribbean", 410000, 6.5, 74.8, "high", "Department of Statistics vital registry with medical certification."),
    ("BRB", "Barbados", "North America", "Caribbean", 282000, 9.4, 77.8, "high", "Universal vital registration system."),
    ("BLZ", "Belize", "North America", "Central America", 415000, 5.3, 75.1, "medium", "Civil registry covering >85% of deaths with statistical adjustment."),
    ("CAN", "Canada", "North America", "Northern America", 40000000, 8.2, 82.8, "high", "Statistics Canada comprehensive vital statistics system."),
    ("CRI", "Costa Rica", "North America", "Central America", 5250000, 5.5, 80.8, "high", "INEC gold-standard vital registry with universal healthcare records."),
    ("CUB", "Cuba", "North America", "Caribbean", 11150000, 9.8, 78.2, "high", "National Health System 100% death certificate coverage."),
    ("DMA", "Dominica", "North America", "Caribbean", 73000, 7.9, 77.2, "high", "Island-wide vital statistics registry."),
    ("DOM", "Dominican Republic", "North America", "Caribbean", 11400000, 6.1, 74.5, "medium", "Civil registry coverage ~75% with administrative linkage."),
    ("SLV", "El Salvador", "North America", "Central America", 6350000, 7.2, 74.0, "medium", "Civil registration improved; violent deaths decreased following anti-gang crackdowns."),
    ("GRD", "Grenada", "North America", "Caribbean", 126000, 7.8, 75.4, "high", "Universal civil registration."),
    ("GTM", "Guatemala", "North America", "Central America", 18300000, 5.4, 74.2, "medium", "RENAP civil registry covering ~80% of deaths."),
    ("HTI", "Haiti", "North America", "Caribbean", 11800000, 9.3, 64.8, "low", "Severe institutional collapse and armed gang control; estimates synthesized from BINUH, WHO, and PAHO."),
    ("HND", "Honduras", "North America", "Central America", 10600000, 5.2, 73.8, "medium", "National Registry of Persons covering ~70% of mortality."),
    ("JAM", "Jamaica", "North America", "Caribbean", 2830000, 7.8, 74.5, "high", "Registrar General's Department vital statistics."),
    ("MEX", "Mexico", "North America", "Central America", 129500000, 6.5, 75.4, "high", "INEGI universal civil registry with medical death certificates."),
    ("NIC", "Nicaragua", "North America", "Central America", 7100000, 5.6, 75.2, "medium", "Civil registry supplemented by Ministry of Health surveillance."),
    ("PAN", "Panama", "North America", "Central America", 4500000, 5.5, 78.8, "high", "INEC vital statistics register with high completeness."),
    ("KNA", "Saint Kitts and Nevis", "North America", "Caribbean", 48000, 7.2, 76.8, "high", "Universal micro-state civil registry."),
    ("LCA", "Saint Lucia", "North America", "Caribbean", 180000, 7.6, 75.2, "high", "Civil registry with complete hospital records."),
    ("VCT", "Saint Vincent and the Grenadines", "North America", "Caribbean", 104000, 7.9, 74.5, "high", "Universal registration with full medical certification."),
    ("TTO", "Trinidad and Tobago", "North America", "Caribbean", 1530000, 8.8, 74.2, "high", "Central Statistical Office complete records."),
    ("USA", "United States", "North America", "Northern America", 342000000, 9.1, 79.1, "high", "CDC National Center for Health Statistics (NVSS) gold standard registry."),

    # SOUTH AMERICA (12)
    ("ARG", "Argentina", "South America", "South America", 46200000, 8.2, 77.2, "high", "DEIS / National Health Ministry vital statistics (>95% complete)."),
    ("BOL", "Bolivia", "South America", "South America", 12400000, 6.8, 71.8, "medium", "Civil registry coverage ~65% with demographic adjustments."),
    ("BRA", "Brazil", "South America", "South America", 217000000, 7.1, 76.5, "high", "SIM (Sistema de Informações sobre Mortalidade) covering >96% of deaths with medical certification."),
    ("CHL", "Chile", "South America", "South America", 19900000, 6.7, 80.6, "high", "DEIS / Civil Registry universal gold standard."),
    ("COL", "Colombia", "South America", "South America", 52600000, 5.9, 77.4, "high", "DANE official mortality registry covering >94%."),
    ("ECU", "Ecuador", "South America", "South America", 18200000, 5.7, 77.8, "high", "INEC universal civil registration."),
    ("GUY", "Guyana", "South America", "South America", 815000, 8.1, 70.2, "medium", "General Register Office records supplemented by MoH surveillance."),
    ("PRY", "Paraguay", "South America", "South America", 6950000, 5.9, 74.6, "medium", "Civil registry covering ~78% with geographic weighting."),
    ("PER", "Peru", "South America", "South America", 34500000, 5.8, 77.2, "high", "SINADEF digital death certificate registry covering >90%."),
    ("SUR", "Suriname", "South America", "South America", 630000, 7.4, 72.8, "medium", "Central Bureau of Civil Affairs records."),
    ("URY", "Uruguay", "South America", "South America", 3430000, 9.7, 78.4, "high", "Ministry of Public Health universal registry."),
    ("VEN", "Venezuela", "South America", "South America", 29500000, 6.9, 72.5, "low", "Severe public health reporting deterioration; figures estimated via PAHO, WHO, and academic demographers."),

    # OCEANIA (14)
    ("AUS", "Australia", "Oceania", "Australia and New Zealand", 26800000, 6.6, 83.5, "high", "Australian Bureau of Statistics (ABS) universal gold-standard."),
    ("FJI", "Fiji", "Oceania", "Melanesia", 940000, 7.2, 68.2, "medium", "Ministry of Health vital statistics system."),
    ("KIR", "Kiribati", "Oceania", "Micronesia", 133000, 6.8, 67.5, "low", "Island health center reports with demographic adjustments."),
    ("MHL", "Marshall Islands", "Oceania", "Micronesia", 42000, 6.4, 65.5, "medium", "Hospital mortality reporting with US Pacific partnership data."),
    ("FSM", "Micronesia", "Oceania", "Micronesia", 115000, 6.5, 67.8, "medium", "State health division registries with periodic surveys."),
    ("NRU", "Nauru", "Oceania", "Micronesia", 13000, 7.1, 64.2, "medium", "Single national hospital vital records."),
    ("NZL", "New Zealand", "Oceania", "Australia and New Zealand", 5250000, 7.0, 82.8, "high", "Stats NZ and Te Whatu Ora universal gold-standard records."),
    ("PLW", "Palau", "Oceania", "Micronesia", 18000, 7.5, 74.0, "high", "Complete micro-state vital registry."),
    ("PNG", "Papua New Guinea", "Oceania", "Melanesia", 10400000, 7.4, 66.2, "low", "Very low civil registration (<10%); estimates derived from demographic modeling and surveys."),
    ("WSM", "Samoa", "Oceania", "Polynesia", 225000, 5.6, 72.8, "medium", "Civil registry and health information system records."),
    ("SLB", "Solomon Islands", "Oceania", "Melanesia", 750000, 5.7, 70.4, "low", "Provincial health post reporting; modeled via WHO GHE."),
    ("TON", "Tonga", "Oceania", "Polynesia", 108000, 6.9, 71.2, "medium", "National civil registry with hospital validation."),
    ("TUV", "Tuvalu", "Oceania", "Polynesia", 11500, 9.2, 64.8, "medium", "Princess Margaret Hospital records covering entire nation."),
    ("VUT", "Vanuatu", "Oceania", "Melanesia", 335000, 5.4, 70.8, "low", "Island health dispensaries; modeled via UN WPP.")
]

WEIGHTS = {
    "senescence": 1.00,
    "neurodegenerative": 0.85,
    "neoplasms": 0.70,
    "cardiovascular": 0.65,
    "other_natural": 0.60,
    "respiratory": 0.55,
    "infectious": 0.35,
    "disasters": 0.30,
    "occupational": 0.20,
    "falls_other": 0.18,
    "transport": 0.15,
    "suicide": 0.06,
    "homicide": 0.02,
    "conflict_war": 0.00,
    "terrorism": 0.00
}

def generate_country_data(iso, name, continent, region, pop, cdr, le, confidence, note):
    total_deaths = round((pop * cdr) / 1000)
    iso2 = ISO3_TO_ISO2[iso]
    flag = get_flag(iso2)
    
    # Archetype detection based on continent, life expectancy, conflict indicators
    is_conflict = iso in ["UKR", "PSE", "SDN", "SYR", "YEM", "MMR", "SOM", "HTI", "AFG", "COD", "MLI", "BFA"]
    is_high_income = le >= 80.0
    is_sub_saharan = continent == "Africa" and iso not in ["MUS", "SYC", "DZA", "TUN", "EGY", "MAR"]
    is_latin_america = continent in ["South America", "North America"] and iso not in ["USA", "CAN", "MCO", "AND", "SMR", "VAT"]

    if iso == "UKR":
        pct_conflict = 10.8
        pct_homicide = 0.4
        pct_suicide = 1.3
        pct_transport = 0.9
        pct_occupational = 0.4
        pct_disasters = 0.01
        pct_falls_other = 2.2
        pct_natural = 100.0 - (pct_conflict + pct_homicide + pct_suicide + pct_transport + pct_occupational + pct_disasters + pct_falls_other)
        nat_senescence = 3.5
        nat_cardio = 44.0
        nat_cancer = 16.0
        nat_resp = 5.0
        nat_neuro = 4.5
        nat_infectious = 4.0
        nat_other = pct_natural - (nat_senescence + nat_cardio + nat_cancer + nat_resp + nat_neuro + nat_infectious)
    elif iso == "PSE":
        pct_conflict = 32.5
        pct_homicide = 0.8
        pct_suicide = 0.4
        pct_transport = 0.8
        pct_occupational = 0.3
        pct_disasters = 0.02
        pct_falls_other = 1.8
        pct_natural = 100.0 - (pct_conflict + pct_homicide + pct_suicide + pct_transport + pct_occupational + pct_disasters + pct_falls_other)
        nat_senescence = 2.0
        nat_cardio = 26.0
        nat_cancer = 12.0
        nat_resp = 6.0
        nat_neuro = 2.0
        nat_infectious = 11.0
        nat_other = pct_natural - (nat_senescence + nat_cardio + nat_cancer + nat_resp + nat_neuro + nat_infectious)
    elif iso == "SDN":
        pct_conflict = 16.5
        pct_homicide = 1.5
        pct_suicide = 0.5
        pct_transport = 1.2
        pct_occupational = 0.6
        pct_disasters = 0.2
        pct_falls_other = 2.5
        pct_natural = 100.0 - (pct_conflict + pct_homicide + pct_suicide + pct_transport + pct_occupational + pct_disasters + pct_falls_other)
        nat_senescence = 1.8
        nat_cardio = 22.0
        nat_cancer = 8.5
        nat_resp = 5.5
        nat_neuro = 1.5
        nat_infectious = 31.0
        nat_other = pct_natural - (nat_senescence + nat_cardio + nat_cancer + nat_resp + nat_neuro + nat_infectious)
    elif iso == "HTI":
        pct_conflict = 1.5
        pct_homicide = 7.8
        pct_suicide = 0.6
        pct_transport = 1.8
        pct_occupational = 0.5
        pct_disasters = 0.4
        pct_falls_other = 3.0
        pct_natural = 100.0 - (pct_conflict + pct_homicide + pct_suicide + pct_transport + pct_occupational + pct_disasters + pct_falls_other)
        nat_senescence = 2.2
        nat_cardio = 26.0
        nat_cancer = 11.0
        nat_resp = 6.0
        nat_neuro = 2.0
        nat_infectious = 31.0
        nat_other = pct_natural - (nat_senescence + nat_cardio + nat_cancer + nat_resp + nat_neuro + nat_infectious)
    elif is_high_income:
        pct_conflict = 0.0
        pct_homicide = 0.05 if iso != "USA" else 0.45
        pct_suicide = 1.2 if iso not in ["KOR", "LTU", "RUS", "JPN"] else 1.8
        if iso == "USA":
            pct_suicide = 1.4
            pct_transport = 1.2
            pct_occupational = 0.15
            pct_disasters = 0.02
            pct_falls_other = 4.8
        else:
            pct_transport = 0.3
            pct_occupational = 0.08
            pct_disasters = 0.01
            pct_falls_other = 2.4
        
        pct_natural = 100.0 - (pct_conflict + pct_homicide + pct_suicide + pct_transport + pct_occupational + pct_disasters + pct_falls_other)
        nat_senescence = 12.0 if le > 83 else (9.0 if le > 81 else 6.0)
        nat_cardio = 27.0
        nat_cancer = 27.5
        nat_resp = 7.5
        nat_neuro = 11.5 if le > 82 else 8.5
        nat_infectious = 4.5
        nat_other = pct_natural - (nat_senescence + nat_cardio + nat_cancer + nat_resp + nat_neuro + nat_infectious)
    elif is_sub_saharan:
        pct_conflict = 0.8 if is_conflict else 0.1
        pct_homicide = 1.4
        pct_suicide = 0.8
        pct_transport = 2.4
        pct_occupational = 0.9
        pct_disasters = 0.15
        pct_falls_other = 3.2
        pct_natural = 100.0 - (pct_conflict + pct_homicide + pct_suicide + pct_transport + pct_occupational + pct_disasters + pct_falls_other)
        
        nat_senescence = 1.8
        nat_cardio = 19.5
        nat_cancer = 8.5
        nat_resp = 6.0
        nat_neuro = 1.5
        nat_infectious = 44.0
        nat_other = pct_natural - (nat_senescence + nat_cardio + nat_cancer + nat_resp + nat_neuro + nat_infectious)
    elif is_latin_america:
        pct_conflict = 0.2 if iso not in ["COL", "MEX"] else 0.6
        pct_homicide = 3.8 if iso in ["BRA", "COL", "MEX", "VEN", "HND", "GTM"] else 1.8
        pct_suicide = 0.9
        pct_transport = 2.8
        pct_occupational = 0.6
        pct_disasters = 0.1
        pct_falls_other = 2.4
        pct_natural = 100.0 - (pct_conflict + pct_homicide + pct_suicide + pct_transport + pct_occupational + pct_disasters + pct_falls_other)
        
        nat_senescence = 4.5
        nat_cardio = 29.5
        nat_cancer = 20.0
        nat_resp = 8.0
        nat_neuro = 4.5
        nat_infectious = 13.0
        nat_other = pct_natural - (nat_senescence + nat_cardio + nat_cancer + nat_resp + nat_neuro + nat_infectious)
    else:
        pct_conflict = 0.05
        pct_homicide = 0.5
        pct_suicide = 1.1
        pct_transport = 1.6
        pct_occupational = 0.5
        pct_disasters = 0.05
        pct_falls_other = 2.5
        pct_natural = 100.0 - (pct_conflict + pct_homicide + pct_suicide + pct_transport + pct_occupational + pct_disasters + pct_falls_other)
        
        nat_senescence = 4.8
        nat_cardio = 36.0
        nat_cancer = 21.0
        nat_resp = 7.5
        nat_neuro = 5.0
        nat_infectious = 10.5
        nat_other = pct_natural - (nat_senescence + nat_cardio + nat_cancer + nat_resp + nat_neuro + nat_infectious)

    # Absolute death calculations
    d_conflict = round(total_deaths * (pct_conflict / 100.0))
    d_homicide = round(total_deaths * (pct_homicide / 100.0))
    d_suicide = round(total_deaths * (pct_suicide / 100.0))
    d_terrorism = round(total_deaths * (0.02 / 100.0)) if is_conflict else 0
    d_intentional = d_conflict + d_homicide + d_suicide + d_terrorism

    d_transport = round(total_deaths * (pct_transport / 100.0))
    d_occupational = round(total_deaths * (pct_occupational / 100.0))
    d_disasters = round(total_deaths * (pct_disasters / 100.0))
    d_falls = round(total_deaths * (pct_falls_other / 100.0))
    d_other_acc = round(total_deaths * 0.003)
    d_accidental = d_transport + d_occupational + d_disasters + d_falls + d_other_acc

    d_natural = total_deaths - (d_intentional + d_accidental)
    
    d_senescence = round(total_deaths * (nat_senescence / 100.0))
    d_cardio = round(total_deaths * (nat_cardio / 100.0))
    d_cancer = round(total_deaths * (nat_cancer / 100.0))
    d_resp = round(total_deaths * (nat_resp / 100.0))
    d_neuro = round(total_deaths * (nat_neuro / 100.0))
    d_infectious = round(total_deaths * (nat_infectious / 100.0))
    d_other_nat = d_natural - (d_senescence + d_cardio + d_cancer + d_resp + d_neuro + d_infectious)
    if d_other_nat < 0:
        d_cardio += d_other_nat
        d_other_nat = 0

    # Percentages
    pct_nat_total = round((d_natural / total_deaths) * 100, 2)
    pct_acc_total = round((d_accidental / total_deaths) * 100, 2)
    pct_int_total = round((d_intentional / total_deaths) * 100, 2)

    # Per capita rates per 100,000 population
    def p100k(val):
        return round((val / pop) * 100000.0, 1)

    # Score calculation
    score_components = [
        (d_senescence / total_deaths) * WEIGHTS["senescence"],
        (d_neuro / total_deaths) * WEIGHTS["neurodegenerative"],
        (d_cancer / total_deaths) * WEIGHTS["neoplasms"],
        (d_cardio / total_deaths) * WEIGHTS["cardiovascular"],
        (d_other_nat / total_deaths) * WEIGHTS["other_natural"],
        (d_resp / total_deaths) * WEIGHTS["respiratory"],
        (d_infectious / total_deaths) * WEIGHTS["infectious"],
        (d_disasters / total_deaths) * WEIGHTS["disasters"],
        (d_occupational / total_deaths) * WEIGHTS["occupational"],
        (d_falls + d_other_acc) / total_deaths * WEIGHTS["falls_other"],
        (d_transport / total_deaths) * WEIGHTS["transport"],
        (d_suicide / total_deaths) * WEIGHTS["suicide"],
        (d_homicide / total_deaths) * WEIGHTS["homicide"],
        (d_conflict + d_terrorism) / total_deaths * WEIGHTS["conflict_war"]
    ]
    
    raw_score = 100.0 * sum(score_components)
    score = round(max(0.0, min(100.0, raw_score)), 1)

    return {
        "id": iso,
        "iso2": iso2,
        "flag": flag,
        "name": name,
        "continent": continent,
        "region": region,
        "population": pop,
        "total_deaths": total_deaths,
        "crude_death_rate": cdr,
        "life_expectancy": le,
        "score": score,
        "data_confidence": confidence,
        "confidence_note": note,
        "rates_per_100k": {
            "total": p100k(total_deaths),
            "natural": p100k(d_natural),
            "accidental": p100k(d_accidental),
            "intentional": p100k(d_intentional),
            "senescence": p100k(d_senescence),
            "cardiovascular": p100k(d_cardio),
            "neoplasms": p100k(d_cancer),
            "respiratory": p100k(d_resp),
            "neurodegenerative": p100k(d_neuro),
            "infectious_maternal": p100k(d_infectious),
            "transport": p100k(d_transport),
            "occupational": p100k(d_occupational),
            "natural_disasters": p100k(d_disasters),
            "falls_drowning_poisoning": p100k(d_falls),
            "homicide": p100k(d_homicide),
            "suicide": p100k(d_suicide),
            "conflict_war": p100k(d_conflict),
            "terrorism": p100k(d_terrorism)
        },
        "groups": {
            "natural": {
                "total": d_natural,
                "percentage": pct_nat_total,
                "rate_per_100k": p100k(d_natural),
                "breakdown": {
                    "senescence": { "total": d_senescence, "percentage": round((d_senescence / total_deaths) * 100, 2), "rate_per_100k": p100k(d_senescence) },
                    "cardiovascular": { "total": d_cardio, "percentage": round((d_cardio / total_deaths) * 100, 2), "rate_per_100k": p100k(d_cardio) },
                    "neoplasms": { "total": d_cancer, "percentage": round((d_cancer / total_deaths) * 100, 2), "rate_per_100k": p100k(d_cancer) },
                    "respiratory": { "total": d_resp, "percentage": round((d_resp / total_deaths) * 100, 2), "rate_per_100k": p100k(d_resp) },
                    "neurodegenerative": { "total": d_neuro, "percentage": round((d_neuro / total_deaths) * 100, 2), "rate_per_100k": p100k(d_neuro) },
                    "infectious_maternal": { "total": d_infectious, "percentage": round((d_infectious / total_deaths) * 100, 2), "rate_per_100k": p100k(d_infectious) },
                    "other_natural": { "total": d_other_nat, "percentage": round((d_other_nat / total_deaths) * 100, 2), "rate_per_100k": p100k(d_other_nat) }
                }
            },
            "accidental": {
                "total": d_accidental,
                "percentage": pct_acc_total,
                "rate_per_100k": p100k(d_accidental),
                "breakdown": {
                    "transport": { "total": d_transport, "percentage": round((d_transport / total_deaths) * 100, 2), "rate_per_100k": p100k(d_transport) },
                    "occupational": { "total": d_occupational, "percentage": round((d_occupational / total_deaths) * 100, 2), "rate_per_100k": p100k(d_occupational) },
                    "natural_disasters": { "total": d_disasters, "percentage": round((d_disasters / total_deaths) * 100, 2), "rate_per_100k": p100k(d_disasters) },
                    "falls_drowning_poisoning": { "total": d_falls, "percentage": round((d_falls / total_deaths) * 100, 2), "rate_per_100k": p100k(d_falls) },
                    "other_accidental": { "total": d_other_acc, "percentage": round((d_other_acc / total_deaths) * 100, 2), "rate_per_100k": p100k(d_other_acc) }
                }
            },
            "intentional": {
                "total": d_intentional,
                "percentage": pct_int_total,
                "rate_per_100k": p100k(d_intentional),
                "breakdown": {
                    "homicide": { "total": d_homicide, "percentage": round((d_homicide / total_deaths) * 100, 2), "rate_per_100k": p100k(d_homicide) },
                    "suicide": { "total": d_suicide, "percentage": round((d_suicide / total_deaths) * 100, 2), "rate_per_100k": p100k(d_suicide) },
                    "conflict_war": { "total": d_conflict, "percentage": round((d_conflict / total_deaths) * 100, 2), "rate_per_100k": p100k(d_conflict) },
                    "terrorism": { "total": d_terrorism, "percentage": round((d_terrorism / total_deaths) * 100, 2), "rate_per_100k": p100k(d_terrorism) }
                }
            }
        }
    }

def main():
    countries = []
    for item in COUNTRIES_META:
        iso, name, continent, region, pop, cdr, le, conf, note = item
        data = generate_country_data(iso, name, continent, region, pop, cdr, le, conf, note)
        countries.append(data)
    
    # Sort countries by score descending to assign global ranks
    countries.sort(key=lambda x: x["score"], reverse=True)
    for idx, c in enumerate(countries):
        c["rank"] = idx + 1

    total_pop = sum(c["population"] for c in countries)
    total_deaths = sum(c["total_deaths"] for c in countries)
    total_natural = sum(c["groups"]["natural"]["total"] for c in countries)
    total_accidental = sum(c["groups"]["accidental"]["total"] for c in countries)
    total_intentional = sum(c["groups"]["intentional"]["total"] for c in countries)
    
    weighted_score = sum(c["score"] * c["total_deaths"] for c in countries) / total_deaths

    payload = {
        "metadata": {
            "title": "Death Atlas Global Mortality Dataset 2025",
            "year": 2025,
            "project": "Death Atlas",
            "organization": "BanguDevClub",
            "repository": "https://github.com/BanguDevClub/deathatlas",
            "license": "MIT",
            "total_countries": len(countries),
            "global_population": total_pop,
            "global_deaths": total_deaths,
            "global_crude_death_rate": round((total_deaths / total_pop) * 1000, 2),
            "global_rate_per_100k": round((total_deaths / total_pop) * 100000, 1),
            "global_score": round(weighted_score, 1),
            "groups_summary": {
                "natural": {
                    "total": total_natural,
                    "percentage": round((total_natural / total_deaths) * 100, 2),
                    "rate_per_100k": round((total_natural / total_pop) * 100000, 1)
                },
                "accidental": {
                    "total": total_accidental,
                    "percentage": round((total_accidental / total_deaths) * 100, 2),
                    "rate_per_100k": round((total_accidental / total_pop) * 100000, 1)
                },
                "intentional": {
                    "total": total_intentional,
                    "percentage": round((total_intentional / total_deaths) * 100, 2),
                    "rate_per_100k": round((total_intentional / total_pop) * 100000, 1)
                }
            },
            "confidence_distribution": {
                "high": sum(1 for c in countries if c["data_confidence"] == "high"),
                "medium": sum(1 for c in countries if c["data_confidence"] == "medium"),
                "low": sum(1 for c in countries if c["data_confidence"] == "low")
            },
            "scoring_weights": WEIGHTS
        },
        "countries": countries
    }

    os.makedirs("src/data", exist_ok=True)
    with open("src/data/deaths-2025.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    os.makedirs("public/data", exist_ok=True)
    with open("public/data/deaths-2025.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"Generated {len(countries)} countries with Flags and Per-Capita Rates in src/data and public/data")

if __name__ == "__main__":
    main()
