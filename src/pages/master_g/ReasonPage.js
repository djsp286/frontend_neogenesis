import Page from 'components/Page';
import React from 'react';
import * as myUrl from '../urlLinkMasterG';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, InputGroup,
    InputGroupAddon, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdSearch, MdEdit } from 'react-icons/md';

class ReasonPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            todos:[],
            isLoading: false,
            inputtedName: "",
            editCode: "",
            rsnName: "",
            searchType:"rsn_runningid",
            keyword:"",
            currentPage: 1,
            todosPerPage: 5,
            totalData:0,
            flag:0,
            currentData: 0,
            lastData: 0,
            selectedDropdown: "Show All",
            displayStatus: "none"
        };
    }

    //run at the start of the page
    componentDidMount() {
        this.getTotalReasonPage();
    }

    //empty all input box
    resetInput(){
        this.setState({
            inputtedName: ''
        })
    }

    //function connection out
    connectionOut(message, render){
        if(render){
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
                modal_nested_parent_edit: false,
                modal_nested: false,
                modal_nested_edit: false,
                backdrop: true,
                modal_delete: false,
                modal_response: true,
                searchType:"Show_All",
                responseHeader: "CONNECTION ERROR",
                responseMessage: message
            },  () => this.pagecount())
        }else{
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
                modal_nested_parent_edit: false,
                modal_nested: false,
                modal_nested_edit: false,
                backdrop: true,
                modal_delete: false,
                modal_response: true,
                responseHeader: "CONNECTION ERROR",
                responseMessage: message
            })
        }
    }

    //set Page Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: parseInt(event.target.value), currentPage: 1
         },() =>{
            this.componentDidMount();
        });
    }

    //set Current Page
    handleWrite(event, flag, forl) {
        if(forl == "first"){
            this.state.currentData = 1; 
        }else if(forl == "last"){
            this.state.currentData = this.state.lastData;
        }else{
            this.state.currentData = Number(event.target.value)+ flag;
            if(this.state.currentData < 1){
                this.state.currentData = 1;
            }
            else if(this.state.currentData > this.state.lastData){
                this.state.currentData = this.state.lastData;
            }
        }
        this.setState({
          currentPage: this.state.currentData
                  },() =>{
            if(flag!==0)
            {
                this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
            }
        });
    }

    enterPressed= (event,search) =>{
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            event.preventDefault();
            this.setState({currentPage: 1}
            ,() =>{ 
                this.getTotalReasonPage();
            });
        } 
    }

    getTotalReasonPage(){
        const urlA=myUrl.url_getTotalReasonPage;
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
              },
            body: JSON.stringify({
                type: this.state.searchType,
                keyword: this.state.keyword,
                limit : this.state.todosPerPage.toString()
            })
        };
        fetch(urlA ,option)
            .then(response => response.json())
            .then(data =>{
                if(data==0){
                    this.setState({
                        responseHeader: "Alert!!!",
                        responseMessage: "Data is empty!",
                        result: [],
                        modal_response: true,
                        isLoading: false
                    });
                }
                else{
                    this.setState({lastData: data} ,()=> this.getListbyPaging(this.state.currentPage,this.state.todosPerPage));
                }
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    getListbyPaging(currPage, currLimit){
        const urlA=myUrl.url_getListReason;
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                type: this.state.searchType,
                keyword: this.state.keyword,
                offset : ((currPage-1)*currLimit).toString(),
                limit : currLimit.toString()
            })
        }
        fetch(urlA,option)
            .then(response => response.json())
            .then(data =>{
                this.setState({ result: data, isLoading: false})
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    insertMasterReason = (reason_name) => () => {
        if(reason_name == ""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Reason name can't be empty!",
                modal_response: true
            });
        }
        else{
            var url = myUrl.url_addNewReason;

            fetch(url, {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Rsn_Name: reason_name,
                    Rsn_UserID: "1"
                })
            }).then(response => {
                if (response.ok) {
                    this.state.modal_nested = false;
                    this.state.modal_nested_parent = false;
                    this.state.currentPage = this.state.lastData;
                    this.componentDidMount();
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data added";
                    this.state.modal_response = true;
                    this.resetInput();
                }else{
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data failed to add";
                    this.state.modal_response = true;
                }
            }).catch(()=>
            {
                this.connectionOut("Can't reach the server", false)
            });            
        }
        
    }

    //edit function
    editMasterReason = (reason_name, reason_code) => () => {
        if(reason_name == ""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Reason name can't be empty!",
                modal_response: true
            });
            
            console.log(this.state.modal_response);
        }
        else if(reason_name == this.state.rsnName){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Reason name can't be the same!",
                modal_response: true
            });
        }
        else{
            var url = myUrl.url_editReason;
            const option={
                method : 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Rsn_Name: reason_name,
                    Rsn_Code: reason_code
                })
            }
            fetch(url,option).then(response => {
                if (response.ok) {
                    this.state.modal_nested_edit = false;
                    this.state.modal_nested_parent_edit = false;
                    this.state.currentPage = this.state.lastData;
                    this.componentDidMount();
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data save";
                    this.state.modal_response = true;
                    this.resetInput();
                }else{
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data failed to edit";
                    this.state.modal_response = true;
                }
            }, ()=> this.connectionOut("Can't reach the server", false));            
        }   
    }

    //hapus diubah jadi edit
    setReasonNotActive = (shift_code) => () => {
        var url = myUrl.url_editReason;
        console.log(shift_code);
        fetch(url, {
            method : 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shift_code: shift_code
            })
        }).then(response => {
            if (response.ok) {
                this.state.modal_delete = false;
                this.state.responseHeader = "Confirmation";
                this.state.responseMessage = "Data deleted";
                this.state.modal_response = true;
                this.componentDidMount();
            }
            else{
                this.state.responseHeader = "Confirmation";
                this.state.responseMessage = "Data failed to delete";
                this.state.modal_response = true;
            }
        }, ()=>  this.connectionOut("Can't reach the server", false));
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateSearchValue(evt){
        this.setState({
            keyword: evt.target.value
        });
    }

    SearchbyButton = param => () =>
    {
        this.setState({currentPage: 1},() =>{this.getTotalReasonPage();});
    } 

    openModalWithReasonCode(code, name){
        this.setState({
            modal_nested_parent_edit: true,
            editCode: code,
            rsnName: name
        })
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested_parent_edit: false,
        modal_nested: false,
        modal_nested_edit: false,
        backdrop: true,
        modal_delete: false,
        modal_response: false,
        responseHeader:"",
        responseMessage:"",
    };

    toggle = modalType => () => {
        console.log(modalType);
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    //search dropdown
    updateSelectionValue(evt){
        if(evt.target.value==="Code")
        {
            this.setState({
                selectedDropdown : evt.target.value,
                searchType: "code",
                displayStatus: 'inline-flex'
            })   
        }
        else if(evt.target.value==="Name")
        {
            this.setState({
                selectedDropdown : evt.target.value,
                searchType: "name",
                displayStatus: 'inline-flex'
            }) 
        }
        else if(evt.target.value === "Show All"){
            this.setState({
                selectedDropdown : evt.target.value,
                searchType: "all",
                keyword: "",
                displayStatus: 'none',
            },()=>{
                this.componentDidMount();
            });
        }
    }

    render() {
        const currentTodos = this.state.result.data;

        const renderTodos = currentTodos && currentTodos.map((todo) => {
            return<tr>
                <th scope="row">{todo.Rsn_Code}</th>
                <td className="py-3">{todo.Rsn_Name}</td>
                {todo.Rsn_ActiveYN === "Y" &&
                    <td className="py-3">
                        <Badge color="success" className="mr-1">Active</Badge>
                    </td>}
                {todo.Rsn_ActiveYN !== "Y" &&
                    <td className="py-3">
                        <Badge color="danger" className="mr-1">Not Active</Badge>
                    </td>}
                {todo.Rsn_ActiveYN === "Y" &&
                    <td>
                        <Button color="danger" size="sm" onClick={()=>this.openModalWithReasonCode(todo.Rsn_Code, todo.Rsn_Name)}><MdEdit/></Button>
                        {/* <Button color="danger" size="sm" onClick={this.toggleEdit('nested_parent_edit',todo.Rsn_Code)}><MdEdit/></Button> */}
                    </td>}
            </tr>
            } ) ;

        return (
            <Page
                title="Alasan Retur"
                breadcrumbs={[{ name: 'reason', active: true }]}
                className="ReasonPage"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardHeader className="d-flex justify-content-between">
                                {/*<ButtonGroup>*/}
                                <UncontrolledButtonDropdown
                                style={{
                                    marginRight: "1.5vw"
                                }}
                                >
                                    <DropdownToggle caret name = "filtermenu" color = "primary">
                                    {this.state.selectedDropdown}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem value = "Show All" onClick = {evt => this.updateSelectionValue(evt)}>Show All</DropdownItem>
                                        <DropdownItem value = "Name" onClick = {evt => this.updateSelectionValue(evt)}>Name</DropdownItem>
                                        <DropdownItem value = "Code" onClick = {evt => this.updateSelectionValue(evt)}>Code</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                                <Input
                                    type="search"
                                    className="cr-search-form__input"
                                    placeholder="Search"
                                    onKeyPress={(e) => this.enterPressed(e,false)}
                                    style={{
                                        marginRight: "0.5vw",
                                        display: this.state.displayStatus
                                    }}
                                    onChange={evt => this.updateSearchValue(evt)}>
                                </Input>
                                <Button
                                  size="md"
                                  style={{
                                      marginRight: "0.5vw",
                                      display: this.state.displayStatus
                                  }}
                                  onClick={this.SearchbyButton()}>
                                    <MdSearch/>
                                </Button>
                                <Button size="sm" onClick={this.toggle('nested_parent')}>Add</Button>
                                <Modal
                                  isOpen={this.state.modal_nested_parent}
                                  toggle={this.toggle('nested_parent')}
                                  className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Add new reason
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Reason Name</Label>
                                        <Input type="namareason" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namareason" placeholder="Reason Name must be filled" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="info" onClick={this.toggle('nested')}>
                                            Save
                                        </Button>
                                        <Modal
                                          isOpen={this.state.modal_nested}
                                          toggle={this.toggle('nested')}
                                        >
                                            <ModalHeader>Confirmation</ModalHeader>
                                            <ModalBody>Are you sure to save the data?</ModalBody>
                                            <ModalFooter>
                                                <Button color="success" onClick={this.insertMasterReason(this.state.inputtedName)}>
                                                    <MdCheckCircle/> Yes
                                                </Button>{' '}
                                                <Button
                                                    color="danger"
                                                    onClick={this.toggle('nested')}>
                                                    <MdHighlightOff/> No
                                                </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="danger" onClick={this.toggle('nested_parent')}>
                                            Cancel
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                                <Modal
                                  //{this.setState({})}
                                  isOpen={this.state.modal_nested_parent_edit}
                                  toggle={this.toggle('nested_parent_edit')}
                                  className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent_edit')}>
                                        Edit Reason
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Reason Name</Label>
                                        <Input type="namareason" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namareason" placeholder="Reason Name must be filled" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="info" onClick={this.toggle('nested_edit')}>
                                            Save
                                        </Button>
                                        <Modal
                                          isOpen={this.state.modal_nested_edit}
                                          toggle={this.toggle('nested_edit')}
                                        >
                                            <ModalHeader>Confirmation</ModalHeader>
                                            <ModalBody>Are you sure to save the data?</ModalBody>
                                            <ModalFooter>
                                                <Button color="success" onClick={this.editMasterReason(this.state.inputtedName, this.state.editCode)}>
                                                    <MdCheckCircle/> Yes
                                                </Button>{' '}
                                                <Button
                                                    color="danger"
                                                    onClick={this.toggle('nested_edit')}>
                                                    <MdHighlightOff/> No
                                                </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="danger" onClick={this.toggle('nested_parent_edit')}>
                                            Cancel
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                                <Modal
                                    isOpen={this.state.modal_response}
                                    toggle={this.toggle('response')}
                                >
                                    <ModalHeader>
                                    {this.state.responseHeader}
                                    </ModalHeader>
                                    <ModalBody>
                                    {this.state.responseMessage}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="success" onClick={ () => { this.setState({ modal_response: false, modal_nested: false, modal_nested_edit:false}) } }>Ok</Button>
                                    </ModalFooter>
                                </Modal>
                                <Modal
                                  isOpen={this.state.modal_delete}
                                toggle={this.toggle('delete')}>
                                    <ModalHeader>Confirmation</ModalHeader>
                                    <ModalBody>Are you sure to delete the data?</ModalBody>
                                    <ModalFooter>
                                        <Button color="success" onClick={this.setReasonNotActive(this.state.activeItemId)}>
                                            Yes
                                        </Button>{' '}
                                        <Button
                                          color="danger"
                                          onClick={this.toggle('delete')}>
                                            No
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                                {/*</ButtonGroup>*/}
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Kode Retur</th>
                                            <th>Nama Retur</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTodos}
                                    </tbody>
                                </Table>

                                <hr/>

                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">Data / Page</InputGroupAddon>
                                    <select
                                    name="todosPerPage"
                                    style={{
                                        height: 'auto'
                                    }}
                                    value={this.state.todosPerPage}
                                    onChange={(e) => this.handleSelect(e)}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                    </select>
                                </InputGroup>

                                <br/>

                                <Form
                                inline
                                className="cr-search-form"
                                onSubmit={e => e.preventDefault()}
                                style={{
                                    justifyContent: "center"
                                }}
                                >
                                    <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,-1, "first")}>First</Button>
                                    <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,-1)}>Prev</Button>
                                    <form >
                                        <input
                                        type="text"
                                        placeholder="Page"
                                        value = {this.state.currentPage}
                                        onKeyPress={(e) => this.enterPressed(e,false)}
                                        onChange={(e) => this.handleWrite(e,0)}
                                        style={{
                                            width: '25px',
                                            height: '38px',
                                            textAlign: 'center'
                                        }}
                                        />
                                    </form>
                                    <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,1)}>Next</Button>

                                    <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,1, "last")}>Last</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }

    
}
export default ReasonPage;
