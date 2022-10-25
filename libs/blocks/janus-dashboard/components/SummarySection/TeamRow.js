import { html, useContext } from '../../../../deps/htm-preact.js';
import { PreprocessContext } from '../../wrappers/PreprocessWrapper.js';
import GridContainer from '../GridContainer.js';
import GridItem from '../GridItem.js';
import Clickable from '../Clickable.js';
import { FilterContext, ActionTypes } from '../../wrappers/FilterWrapper.js';

function TeamRow() {
  const { mapByConsumer, cntMapByConsumer } = useContext(PreprocessContext);
  const { dispatch } = useContext(FilterContext);
  const getOnClickTeamStatus = (team, status) => () => {
    dispatch({ type: ActionTypes.SET_STATE, payload: { team, status, showDetail: true } });
  };
  const cols = Object.keys(mapByConsumer).map((team) => {
    const cntMap = cntMapByConsumer[team];
    const total = Object.keys(cntMap).reduce(
      (acc, currFeature) => acc + cntMap[currFeature].total,
      0,
    );
    const passed = Object.keys(cntMap).reduce(
      (acc, currFeature) => acc + cntMap[currFeature].passed,
      0,
    );
    const failed = total - passed;
    return html`
    <${GridItem}><div>${team}</div>
      <${Clickable} color='green' onClick=${getOnClickTeamStatus(team, 'passed')}>${passed}</${Clickable}>
       ${' / '} <${Clickable} color='red' onClick=${getOnClickTeamStatus(team, 'failed')}>${failed}</${Clickable}>
       ${' / '} <${Clickable} color='yellow' onClick=${getOnClickTeamStatus(team, null)}>${total}</${Clickable}>
    </${GridItem}>`;
  });
  return html`<${GridContainer}> ${cols} <//>`;
}

export default TeamRow;
