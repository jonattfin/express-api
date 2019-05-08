import _ from 'lodash';

export default class AutoMapper {
  static mapPost(post, user) {
    const model = getModel(post);
    if (!model) {
      return undefined;
    }

    const {
      _id, author, images, topics, comments, ...rest
    } = model;

    let postAuthorPP;
    if (author.profilePicture) {
      const { guid, url } = author.profilePicture;

      postAuthorPP = {
        id: guid, url,
      };
    }

    const numberOfComments = _.size(comments);
    let lastComment;

    if (numberOfComments > 0) {
      const c = _.first(_.orderBy(comments, ['lastUpdatedOn'], ['desc']));

      let authorPP;
      if (c.author.profilePicture) {
        authorPP = {
          id: c.author.profilePicture.guid,
          url: c.author.profilePicture.url,
        };
      }

      lastComment = {
        id: c._id,
        text: c.text,
        createdOn: c.createdOn,
        lastUpdatedOn: c.lastUpdatedOn,
        author: {
          id: c.author._id,
          username: c.author.username,
          profilePicture: authorPP,
        },
      };
    }

    return {
      id: _id,
      ...rest,
      isFavorite: user.favoritePosts.indexOf(_id) !== -1,
      topics: topics.map(t => t._id),
      images: images.map(img => ({ id: img.guid, url: img.url })),
      author: {
        id: author._id,
        username: author.username,
        profilePicture: postAuthorPP,
      },
      comments: {
        count: numberOfComments,
        lastComment,
      },
    };
  }

  static mapCommentsFromPost(post) {
    const model = getModel(post);
    if (!model) {
      return undefined;
    }

    return _.orderBy(model.comments, ['lastUpdatedOn'], ['desc']).map((c) => {
      const { author } = c;

      let authorPP;
      if (author.profilePicture) {
        authorPP = {
          id: c.author.profilePicture.guid,
          url: c.author.profilePicture.url,
        };
      }

      return {
        id: c._id,
        text: c.text,
        lastUpdatedOn: c.lastUpdatedOn,
        author: {
          id: author._id,
          username: author.username,
          profilePicture: authorPP,
        },
      };
    });
  }

  static mapUser(user) {
    const model = getModel(user);
    if (!model) {
      return undefined;
    }

    const {
      _id, password, profilePicture, ...rest
    } = model;

    let pp;
    if (profilePicture) {
      const { guid, url } = profilePicture;
      pp = { id: guid, url };
    }

    return {
      id: _id,
      profilePicture: pp,
      ...rest,
    };
  }

  static mapTopic(topic) {
    const model = getModel(topic);
    if (!model) {
      return undefined;
    }

    const { _id, ...rest } = model;
    return { id: _id, ...rest };
  }

  static mapDevice(device) {
    const model = getModel(device);
    if (!model) {
      return undefined;
    }

    const { _id, ...rest } = model;
    return { id: _id, ...rest };
  }
}

function getModel(input) {
  if (!input) {
    return undefined;
  }

  const { __v, ...rest } = input.toObject(); // eslint-disable-line
  return rest;
}
