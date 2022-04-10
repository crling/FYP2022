## Introduction
The `FMT Overview` displays the overall data of the analyses. It contains stacked , and a metadata heatmap in the bottom.

## Input Files
_Click on the `Download Data` button to check the official input files._

#### 1. Strain proportion data (TSV file)

| Species |  Sample | Source | Abd |
|---|---|---|---|
| Streptococcus_thermophilus  | DS04  | clu01 | 100 |

- Source represents strain, Abd represents proportion

#### 2. Metadata (TSV file)

| spe |  group | type |
|---|---|---|
| Streptococcus_thermophilus  | Other(11)  | from_donor |

- The first column is the species. The column name doesn't matter. You may add as many meta features as you like.

## Display Interactions

- **Add Title**<br/>
  Double click the title text in the center and add your title.
- **Tooltips**<br/>
  Hover on the bar or meta grid and a info tooltip will show.
- **Download**<br/>
  One SVG file will be generated when the `Download Chart` button is clicked.

## Editor Functions

- **Files**
  - __*Manage Files*__: checklist of files uploaded previously, delete or download files.
  - __*Upload*__: upload files. Note that the duplicated file name will be alerted and given a random postfix.
  - __*Choose*__: choose files uploaded previously. 

- **General::Common**
  - __*Bar width*__: input a value to adjust the bar width and meta grid width.
  - __*Strain plot height*__: input a value to adjust the bar height.
  - __*Label rotation angle*__: input a value to adjust the species label rotation angle.
  - __*Italic label*__: check the checkbox to draw _italic_ species labels.
  - __*Reorder sample*__: drag the sample labels to reorder them.

- **General::Species**
  - __*Reorder Species*__: add sorting criteria of metadata to reorder the species, click use default to restore.
  - __*Reorder Species Manually*__: drag the species labels to reorder the species manually.
  - __*Filter Species*__: uncheck the unwanted species labels to hide them.
  - __*Highlight Species*__: check the species labels you want to highlight to draw the labels in red.
  - __*Show ordered species list*__: check the ordered species.

- **Meta Panel**
  - __*Settings*__: drag to reorder the metadata categories, set colors for the categories.
  - __*Reorder*__: drag to reorder the metadata. 


*Manual version=1.0*, written by Dr. JIANG Yiqi and Ms. WANG Yanfei on 2021-09-13.