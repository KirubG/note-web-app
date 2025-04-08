import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const Taginput = ({ tags, setTags }) => {
                      let [inputValue, setInputValue] = useState("");

                      const handleChange = (e) => {
                        setInputValue(e.target.value);
                      };
                      const addNewTag = () => {
                        if (inputValue.trim() !== "") {
                          setTags([...tags, inputValue.trim()]);
                          setInputValue("");
                        }
                      };

                      const handleKeyDown = (event) => {
                        if (event.key === "Enter") {
                          addNewTag();
                        }
                      };

                      const handleRemoveTag = (tagToRemove) => {
                        setTags(tags.filter((tag) => tag !== tagToRemove));
                      };

  return (
    <>
      {tags.length > 0 && (
        <div className="flex gap-2">
          {tags.map((tag, index) => {
            return (
              <div className="flex items-center gap-3 p-1 bg-slate-300">
                <span className="flex font-semibold font-poppins text-sm ">
                  #{tag}
                </span>
                <button
                  onClick={() => {
                    handleRemoveTag(tag);
                  }}
                  className=" flex items-center"
                >
                  <MdClose className="text-slate-500 hover:text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <input
          type="text"
          placeholder="Add tags"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="outline-none p-2 border-2 border-[rgb(180,180,180)] rounded-xl "
        />
        <button
          onClick={() => {
            addNewTag();
          }}
          className="p-2 border-2 rounded  text-blue-500 hover:bg-blue-500 hover:text-white"
        >
          <MdAdd className="text-2xl" />{" "}
        </button>
      </div>
    </>
  );
};

export default Taginput;
