import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";

const schema = z.object({
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" }),
  amount: z
    .string()
    .refine((value) => parseInt(value), { message: "Amount is required" }),
  category: z.string().min(1, "Category is required"),
});

interface TableRow {
  description: string;
  amount: number;
  category: string;
}

type FormData = z.infer<typeof schema>;

const Form = () => {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [selected, setSelected] = useState("");

  const onDelete = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const filterCategories = () => {
    return rows.filter((item) => {
      return selected === "all"
        ? item
        : item.category.toLowerCase().includes(selected.toLowerCase());
    });
  };

  const handleSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    setRows([
      ...rows,
      {
        description: data.description,
        amount: parseInt(data.amount),
        category: data.category,
      },
    ]);
  };

  return (
    <>
      <form action="" onSubmit={handleSubmit(onSubmit)} className="mt-12">
        <div className="container flow-content--m">
          <div className="wrapper">
            <label htmlFor="">Description</label>
            <input
              type="text"
              className="w-full p-2"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description?.message}</p>
            )}
          </div>
          <div className="wrapper">
            <label htmlFor="">Amount</label>
            <input
              type="number"
              className="w-full p-2"
              {...register("amount", { required: true })}
            />
            {errors.amount && (
              <p className="text-red-500">{errors.amount?.message}</p>
            )}
          </div>
          <div className="wrapper">
            <label htmlFor="">Category</label>
            <select
              className="w-full p-2 mb-8 bg-white border-2 border-gray-300 rounded-md"
              {...register("category", { required: true })}
            >
              <option value=""></option>
              <option value="groceries">Groceries</option>
              <option value="utilities">Utilities</option>
              <option value="entertainment">Entertainment</option>
            </select>
            {errors.category && (
              <p className="text-red-500">{errors.category?.message}</p>
            )}
          </div>
          <button
            type="submit"
            className={
              !isValid
                ? "bg-gray-700 text-white duration-300  py-2 px-8 rounded-md !mt-0"
                : "bg-cyan-500 text-white duration-300 hover:bg-cyan-600 py-2 px-8 rounded-md !mt-0"
            }
          >
            Submit
          </button>
        </div>
      </form>

      <section className="py-16">
        <div className="container">
          <select
            name=""
            id=""
            className="w-full p-4 mb-8 bg-white border-2 border-gray-300 rounded-md"
            onChange={handleSelected}
          >
            <option value="all">All categories</option>
            <option value="groceries">Groceries</option>
            <option value="utilities">Utilities</option>
            <option value="entertainment">Entertainment</option>
          </select>
          <table className="w-full">
            <thead>
              <tr className="">
                <th className="py-2 border-2 border-r-0 border-black">
                  Description
                </th>
                <th className="py-2 border-2 border-r-0 border-black">
                  Amount
                </th>
                <th className="py-2 border-2 border-r-0 border-black">
                  Category
                </th>
                <th className="py-2 border-2 border-black">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filterCategories().map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2">${item.amount}</td>
                  <td className="py-2">{item.category}</td>
                  <td className="py-2">
                    <button
                      className="px-4 py-1 text-red-500 duration-300 border-2 border-red-500 rounded-md hover:bg-red-500 hover:text-white"
                      onClick={() => onDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr className={rows.length === 0 ? "hidden" : ""}>
                <td colSpan={3}>Total</td>
                <td className="border-r-2 border-black">
                  $
                  {filterCategories().reduce(
                    (acc, curr) => acc + curr.amount,
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Form;
