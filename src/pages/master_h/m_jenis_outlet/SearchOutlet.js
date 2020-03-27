import React from 'react';
import { MdSearch } from 'react-icons/md';
import { Button, Form, Input } from 'reactstrap';

const SearchOutlet= (props) => {
  return (
    <div>
        <Form inline className="cr-search-form" onSubmit={e => e.preventDefault()}>
            <MdSearch
                size="20"
                className="cr-search-form__icon-search text-secondary"
            />
            <Input
                type="search"
                className="cr-search-form__input"
                placeholder="Search..."
                onChange = {(e) => props.getSearchText(e.target.value.toLocaleLowerCase())}
            />
            {/* <Button size="20">Find</Button> */}
        </Form>
        
    </div>
   

  );
};

export default SearchOutlet;