import needle from 'needle';
import settings from '../../../app.settings.json';
import logger from '../../logger';
import { getDateDisplay } from '../helper';

export async function getMyTwitterData() {
  try {
    const response = await needle(
      'get',
      `${settings.api.twitterApi}/2/users/${settings.social_media.twitter.userid}/tweets`,
      {
        max_results: 100,
        'tweet.fields':
          'created_at,conversation_id,in_reply_to_user_id,referenced_tweets',
        expansions: 'author_id'
      },
      {
        headers: {
          'User-Agent': 'v2TweetLookupJS',
          authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
      }
    );

    if (!response.body) {
      logger.error('getMyTwitterData() - response body is empty');
      throw new Error('Error occurred retrieving data');
    }

    return response.body.data
      .filter((x) => x['in_reply_to_user_id'] === undefined)
      .map((d) => {
        return {
          id: d.id,
          content: d.text,
          // imageUrl: 'https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d',
          source: 'twitter',
          date: new Date(d['created_at']),
          displayDate: getDateDisplay(d['created_at']),
          link: `https://twitter.com/${settings.social_media.twitter.username}/status/${d.id}`
        };
      });
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}
