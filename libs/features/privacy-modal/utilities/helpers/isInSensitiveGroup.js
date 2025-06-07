import config from '../config.js';

const isInSensitiveGroup = (groups) => {
  // Age based groups
  const ageBasedGroup = groups.filter((tag) => config.restrictions.userTags.age.includes(tag));
  if (ageBasedGroup.length) {
    return [true, ageBasedGroup];
  }

  // EDU based groups
  const eduGroup = groups.filter((tag) => config.restrictions.userTags.edu.includes(tag));
  if (eduGroup.length) {
    // EDU restrictions should only be applied if there's no edu_teacher
    // OR (edu_teacher AND edu_student) are both available.
    if (groups.includes('edu_teacher')) {
      if (groups.includes('edu_student')) {
        return [true, eduGroup];
      }

      return [false];
    }

    return [true, eduGroup];
  }

  return [false];
};

export default isInSensitiveGroup;
