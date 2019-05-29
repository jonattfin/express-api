export default class AutoMapper {
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
}

function getModel(input) {
  if (!input) {
    return undefined;
  }

  const { __v, ...rest } = input.toObject(); // eslint-disable-line
  return rest;
}
