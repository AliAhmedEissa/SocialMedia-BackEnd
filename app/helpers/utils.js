export function sendErrorResponse(next,err,code = 500) {
  console.log(err);
    return next(new Error(err, { cause: code }));
  }

  export const systemRoles = {
    USER :'user',
    ADMIN :'admin',
    SUPER_ADMIN :'super_admin',
  }

  export const postStatus = {
    PUBLIC :'public',
    PRIVATE :'private',
  }

  export const gender = {
    MALE :'male',
    FEMALE :'female',
  }

  export const fileValidation = {
    image: ["image/png", "image/jpeg","image/jpg","image/png"],
    file: ["applicaton/pdf"],
  };
  
  export const formateDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };


  export const populationOfLikes = {
    path: "likes",
    populate: {
      path: "createdBy",
    },
  };
  
  export const populationOfComments = {
    path: "comments",
    populate: {
      path: "createdBy",
    },
  };
  
  export const populationOfAuthor = {
    path: "author",
  };