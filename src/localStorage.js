export const get = () => JSON.parse(localStorage.getItem('state')) || undefined;
export const set = (state, props) => {
  let toSave = {};

  props.map(p => toSave[p] = state[p]);
  localStorage.setItem('state', JSON.stringify(toSave));
}