import kebabCase from 'lodash/kebabCase';
import { GET_TEAM_URL, getURLFromParams } from 'utils/getURLFromParams';

export const TEAM__SET_CONTENT = 'TEAM__SET_CONTENT';
export const TEAM__SET_ERROR_MESSAGE = 'TEAM__SET_ERROR_MESSAGE';

export const getStaticContentFilename = ({ type, payload }) =>
  `${type}${payload.section ? `/${kebabCase(payload.section)}` : ''}`;

export const getTeamData = mock => (dispatch, getState) => {
  const { groups, members } = getState().staticContent;
  if (!groups || !members) {
    const url = getURLFromParams(GET_TEAM_URL, null, mock);
    fetch(url)
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .then(({ data }) =>
        dispatch({
          type: TEAM__SET_CONTENT,
          payload: { data }
        })
      )
      .catch(reason => {
        console.error('Error loading team members data', reason);
        dispatch({
          type: TEAM__SET_ERROR_MESSAGE,
          payload: { errorMessage: reason.message }
        });
      });
  }
};
