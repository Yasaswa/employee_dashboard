import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

const SearchBar = ({ setSearchedValue }) => {
    const [enteredVal, setEnteredVal] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchedValue(enteredVal.toUpperCase());
        }, 500);

        return () => clearTimeout(timer);
    }, [enteredVal, setSearchedValue]);

    return (
        <>
            <div className="col-sm-auto mt-1">
                <Form.Label className="erp-form-label">
                    Search By Name
                </Form.Label>
            </div>

            <div className="col-sm-7">
                <Form.Control
                    type="text"
                    className="erp_input_field ps-1"
                    value={enteredVal}
                    onChange={(e) =>
                        setEnteredVal(e.target.value)
                    }
                />
            </div>
        </>
    );
};

export default React.memo(SearchBar);
