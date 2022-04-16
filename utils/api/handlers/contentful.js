import needle from 'needle';
import { getDateDisplay } from '../helper';
import settings from '../../../app.settings.json';
import logger from '../../logger';

// see for graphql exploration: https://graphql.contentful.com/content/v1/spaces/{spaceId}/explore?access_token={access_token}
const POST_BY_ID_GRAPHQL_QUERY = (id) => `
{
  post(id: "${id}") {
    sys {
      id
      publishedAt
    }
    title
    content {
      json
    }
    tags
    postImage {
      url
    }
  }
}`;

const ALL_POSTS_GRAPHQL_QUERY = `
{
  postCollection {
    total
    items {
      sys {
        id
        publishedAt
      }
    	title
      content {
        json
      }
      tags
      postImage {
        url
        width
        height
        contentType
        title
        description
        fileName
      }
    }
  }
}`;

const ALL_PROJECTS_GRAPHQL_QUERY = `
{
  projectCollection {
    total
    items {
      sys {
        id
        publishedAt
      }
      title
      description {
        json
      }
      image {
        title
        description
        contentType
        fileName
        size
        url
        width
        height
      }
      github
    }
  }
}`;

export async function getBlogById(id) {
  return await baseQuery(POST_BY_ID_GRAPHQL_QUERY(id));
}

export async function getAllBlogs() {
  logger.info('getAllBlogs() - fetching contentful blogs');
  console.log('getAllBlogs() - fetching contentful blogs');
  const response = await baseQuery(ALL_POSTS_GRAPHQL_QUERY);

  const { postCollection = {} } = response;
  const { items = [] } = postCollection;
  return items.map((d) => {
    return {
      id: d.sys.id,
      title: d.title,
      content: d.content,
      imageUrl: d.postImage.url,
      source: 'blog',
      date: new Date(d.sys.publishedAt),
      displayDate: getDateDisplay(d.sys.publishedAt),
      link: `/blogs/${d.sys.id}`
    };
  });
}

export async function getAllProjects() {
  logger.info('getAllProjects() - fetching contentful projects');
  console.log('getAllProjects() - fetching contentful projects');
  const response = await baseQuery(ALL_PROJECTS_GRAPHQL_QUERY);
  const { projectCollection = {} } = response;
  const { items = [] } = projectCollection;
  return items.map((i) => {
    return {
      id: i.sys.id,
      title: i.title,
      description: i.description,
      image: i.image,
      github: i.github
    };
  });
}

async function baseQuery(query) {
  try {
    logger.info('baseQuery()', {
      query,
      at: process.env.CONTENTFUL_ACCESS_TOKEN,
      spaceid: process.env.CONTENTFUL_SPACE_ID,
      api: settings.api.contentfulApi
    });
    console.log('baseQuery()', {
      query,
      at: process.env.CONTENTFUL_ACCESS_TOKEN,
      spaceid: process.env.CONTENTFUL_SPACE_ID,
      api: settings.api.contentfulApi
    });
    const response = await needle(
      'post',
      `${settings.api.contentfulApi}/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
      { query },
      {
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`
        }
      }
    );
    logger.info('baseQuery() - response received', {
      body: response.body,
      statusCode: response.statusCode
    });
    console.log('baseQuery() - response received', {
      body: response.body,
      statusCode: response.statusCode
    });
    if (!response.body) {
      logger.error({
        error: 'Response body was empty',
        handler: 'contentful - baseQuery',
        params: { query }
      });
      console.log({
        error: 'Response body was empty',
        handler: 'contentful - baseQuery',
        params: { query }
      });
      throw new Error('Error occurred retrieving data from contentful');
    }

    if (response.statusCode === 401) {
      logger.error({
        errors: response.body.errors
      });
      console.log({
        errors: response.body.errors
      });

      throw new Error(response.body.errors);
    }
    return response.body.data;
  } catch (error) {
    logger.error({
      error,
      handler: 'contentful - baseQuery',
      params: { query }
    });
    console.log({
      error,
      handler: 'contentful - baseQuery',
      params: { query }
    });
    throw new Error(error);
  }
}
