import React from "react";
import { option, attribute } from "../types/sharedTypes";
import { useForm } from "react-hook-form";

type AttributeFormProps = {
  attributes: attribute[];
  options: option[];
  updateAttributes: (attributes: attribute[]) => void;
  updateOptions: (options: option[]) => void;
  closeForm: () => void;
};

interface IFormInput {
  attributeName: string;
  weight: number;
}

function AttributeForm({
  attributes,
  options,
  updateAttributes,
  updateOptions,
  closeForm,
}: AttributeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IFormInput>();
  const createAttribute = (data: IFormInput) => {
    const newAttribute: attribute = {
      id: `attr-${attributes.length}`,
      name: data.attributeName,
      weight: Number(data.weight) || 1,
      value: 50,
    };
    const newOptions = options.map((opt) => {
      opt.attributes = [...opt.attributes, newAttribute];
      return opt;
    });
    updateAttributes([...attributes, newAttribute]);
    updateOptions(newOptions);
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ attributeName: "", weight: 100 });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <section className="text-center">
      <form onSubmit={handleSubmit(createAttribute)}>
        <h2>Create attribute</h2>
        <div className="flex justify-center space-x-2">
          <div className="flex flex-col min-w-[30%]">
            <input
              className="input input-bordered"
              type="text"
              placeholder="Enter attribute name"
              {...register("attributeName", {
                required: "Please enter attribute name",
                maxLength: 40,
              })}
            />
            {errors.attributeName && (
              <span className="bg-yellow-400 rounded">
                {errors.attributeName?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-[30%]">
            <input
              className="input input-bordered"
              type="number"
              min="1"
              max="100"
              placeholder="Enter weighting"
              {...register("weight", {
                required: "Please enter a weighting between 0 and 100",
                min: 0,
                max: 100,
              })}
              defaultValue={100}
            />
            {errors.weight && (
              <span className="bg-yellow-400 rounded">
                {errors.weight?.message}
              </span>
            )}
          </div>
          <button className="btn btn-secondary" type="submit">
            Done
          </button>
          <button className="btn btn-circle btn-outline" onClick={closeForm}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}

export default AttributeForm;
