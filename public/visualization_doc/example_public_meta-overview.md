# Introduction
The 'Overview' displays the overall data of the analyses. It contains a stacked histogram on the top, an abundance heatmap in the middle, a tree in the middle left, a boxplot of  and a meta info heatmap at the bottom. 

Mutation information can be viewed in three levels (genome, cDNA, and peptide). Different icons are applied to mutations according to their types and function changes, such as synonymous and missense SNV, frame-shift InDels. Interactive tooltip gives more information, including mutation coordinates, function area and details of exons. Sidebar offers options to adjust displays, such as changing resolution, and selecting mutation. This visualization is commonly utilized to show the mutation landscape of given genes in a group of cancer samples.

# Input Files
Click on the `Download Data` button to check the official input files.

## Profiling Table
Metaphlan3 formatted input.

## Meta info

## Species grouping tree (Optional)

A newick. If not given, Gutmeta will extract the metaphylumn2 and draw the tree. 

# Display Interactions

- **Highlight**<br/>
  Hover on the main matrix grid and the will be highlighted by bounding black rect.
- **Tooltips**<br/>
  Hover on the box and the tooltip of data will show.
- **Drag**<br/>
  Drag a legend to change its position.
- **Download**<br/>
  One SVG file will be generated when the '**Download**' button is clicked.

# Sidebar Functions

- **Files**
  - __*Manage Files*__: checklist of files uploaded previously, delete or download files.
  - __*Upload*__: upload files. Note that the duplicated file name will be alerted and given a random postfix.
  - __*Choose*__: choose files uploaded previously. 
  > Notice that those input data accepting multiple files use all uploaded files so you cannot choose specific files for those data.

- **Data**
  - __*Taxonomic Rank*__: select the rank of the data to display.
  - __*Range lower bound*__: edit the mininum of the value range.
  - __*Range upper bound*__: edit the maximum of the value range.

- **Plot Setting**<br/>
  - __*Rotate x labels*__: display rotated labels aligned middle-right or normal labels aligned top-centre
