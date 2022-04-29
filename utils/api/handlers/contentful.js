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

const AWARD_BY_ID_GRAPHQL_QUERY = (id) => `
{
  award(id: "${id}") {
    sys {
      id
      publishedAt
    }
    title
    content {
      json
    }
    awardImage {
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

const ALL_AWARDS_GRAPHQL_QUERY = `
{
  awardCollection {
    total
    items {
      sys {
        id
        publishedAt
      },
      title
      content {
        json
      }
      awardImage {
        url
        width
        height
      }
    }
  }
}`;

// this is quick, dirty and fragile. I can handle this better
function getAwardType(title) {
  if (title.toLowerCase().includes('stem')) return 'stem';
  if (title.toLowerCase().includes('bridges')) return 'bridges';
  return 'unknown';
}

export async function getBlogById(id) {
  return await baseQuery(POST_BY_ID_GRAPHQL_QUERY(id));
}

export async function getAwardById(id) {
  const response = await baseQuery(AWARD_BY_ID_GRAPHQL_QUERY(id));
  return {
    ...response,
    award: {
      ...response.award,
      type: getAwardType(response.award.title),
      awardAmount: 500
    }
  };
}

export async function getAllBlogs() {
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

export async function getallAwards() {
  const response = await baseQuery(ALL_AWARDS_GRAPHQL_QUERY);
  const { awardCollection = {} } = response;
  const { items = [] } = awardCollection;
  return items.map((i) => {
    return {
      id: i.sys.id,
      title: i.title,
      content: i.content,
      image: i.awardImage,
      link: `/community/awards/${i.sys.id}`,
      type: getAwardType(i.title),
      awardAmount: 500
    };
  });
}

async function baseQuery(query) {
  try {
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
    if (!response.body) {
      throw new Error('Error occurred retrieving data from contentful');
    }

    if (response.statusCode === 401) {
      throw new Error(response.body.errors);
    }
    return response.body.data;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}
