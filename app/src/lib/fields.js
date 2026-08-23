// The 20 field colours read off gap-map.org's own field-gradient-0..19 classes, in
// their order, so a field pill here is the same colour as a field pill there.
export const FIELD_COLOR = {
  'Astrophysics': 'rgb(39, 231, 93)',
  'Biophysics': 'rgb(51, 213, 126)',
  'Biosecurity': 'rgb(60, 196, 153)',
  'Cellular and Molecular Biology': 'rgb(71, 180, 172)',
  'Chemistry': 'rgb(68, 164, 185)',
  'Computation': 'rgb(67, 144, 191)',
  'Ecology': 'rgb(69, 123, 194)',
  'Geophysics and Climate': 'rgb(75, 99, 193)',
  'Global Health': 'rgb(93, 79, 191)',
  'Immunology': 'rgb(125, 75, 187)',
  'Materials Science': 'rgb(154, 80, 172)',
  'Mechanical Engineering': 'rgb(176, 78, 144)',
  'Metascience': 'rgb(192, 71, 103)',
  'Nanoscale Fabrication': 'rgb(203, 71, 67)',
  'Neuroscience': 'rgb(211, 91, 56)',
  'Physics': 'rgb(215, 111, 49)',
  'Physiology and Medicine': 'rgb(216, 132, 45)',
  'Social Science': 'rgb(218, 151, 41)',
  'Space Engineering': 'rgb(220, 171, 38)',
  'Synthetic Biology': 'rgb(225, 189, 33)',
};
export const fieldColor = (f) => FIELD_COLOR[f] ?? 'var(--rule)';
