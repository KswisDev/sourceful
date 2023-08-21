import React from "react";
import { option, attribute } from "../types/sharedTypes";
import { useForm } from "react-hook-form";

type OptionFormProps = {
  attributes: attribute[];
  options: option[];
  updateOptions: (options: option[]) => void;
  closeForm: () => void;
};

interface IFormInput {
  optionName: string;
}

function OptionForm({
  attributes,
  options,
  updateOptions,
  closeForm,
}: OptionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IFormInput>();
  const createOption = (data: IFormInput) => {
    const newOption: option = {
      id: `opt-${options.length}`,
      name: data.optionName,
      attributes: [...attributes],
      score: 0,
    };

    updateOptions([...options, newOption]);
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ optionName: "" });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <section className="text-center">
      <form onSubmit={handleSubmit(createOption)}>
        <h2>Create option</h2>
        <div className="flex justify-center space-x-2">
          <div className="flex flex-col">
            <input
              className="input input-bordered"
              type="text"
              placeholder="Enter option name"
              {...register("optionName", {
                required: "Please enter option name",
                maxLength: 40,
              })}
            />
            {errors.optionName && (
              <span className="bg-yellow-400 rounded">
                {errors.optionName?.message}
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

export default OptionForm;
