import Joi from "joi";

export const gymJoiSchema = Joi.object({
  gym: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(10),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});
