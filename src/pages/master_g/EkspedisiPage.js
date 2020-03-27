import Page from 'components/Page';
import "react-datepicker/dist/react-datepicker.css";
import React from 'react';
import * as myUrl from '../urlLinkMasterG';
import {
    Button, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, ButtonGroup, InputGroup,
    InputGroupAddon, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdSearch, MdEdit} from 'react-icons/md';

class EkspedisiPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            todos:[],
            isLoading: false,
            inputtedNmexNama: '',
            inputtedNmexKode: '',
            editNmexNama: '',
            editNmexKode: '',
            searchType:"all",
            keyword:"",
            currentPage: 1,
            todosPerPage: 5,
            totalData:0,
            flag:0,
            currentData: 0,
            lastData: 0,
            selectedDropdown: "Show All",
            disabledNmexKode: true,
            displayStatus: "none"
        };
    }

    componentDidMount() {
        this.getTotalExpeditionPage();
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
                modal_response: true,
                searchType:"all",
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
                modal_response: true,
                responseHeader: "CONNECTION ERROR",
                responseMessage: message
            })
        }
    }

    //set Current Limit
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
                console.log(this.state.lastData)
                this.state.currentData = this.state.lastData;
            }
        }
        console.log(this.state.currentData);
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
                // this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
                this.getTotalExpeditionPage();
            });
        } 
    }
    getTotalExpeditionPage(){
        const kword = this.state.keyword;
        const typeex = this.state.searchType;
        const currLimit = this.state.todosPerPage; 

        const urlA=myUrl.url_getTotalExpedisiPage;
        var payload = {
            keyword: kword,
            limit : currLimit.toString(),
            type : typeex
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
              },
            body: JSON.stringify(payload)
        };
        fetch(urlA ,option)
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                if(data==0){
                    this.setState({
                        responseHeader: "Alert!!!",
                        responseMessage: "Data is empty!",
                        modal_response: true,
                        result: data,
                        isLoading: false
                    });
                }
                else{
                    this.setState({lastData: data} ,()=> this.getListbyPaging(this.state.currentPage,this.state.todosPerPage));
                }
            }, ()=> this.connectionOut("Can't reach the server", false));
    }
    
    getListbyPaging(currPage,currLimit){
        const kword = this.state.keyword;
        const typeex = this.state.searchType;
        
            const urlA=myUrl.url_getExpedisiList;
                var payload = {
                    type: typeex,
                    keyword: kword,
                    offset : ((currPage-1)*currLimit).toString(),
                    limit : currLimit.toString()
                };
                const option = {
                    method: "POST",
                    json: true,
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    },
                    body: JSON.stringify(payload)
                }
                fetch(urlA,option)
                    .then(response => response.json())
                    .then(data =>{
                        console.log(data)
                        this.setState({ result: data, isLoading: false})
                    }, ()=> this.connectionOut("Can't reach the server", false));
    }

    insertNewExpedition = (nmex_nama, nmex_kode) => () => {
        console.log("stnk: " + this.state.inputtedTglSTNK)
        if(nmex_nama == ""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Nama Ekspedisi can't be empty!",
                modal_response: true
            });
            
            console.log(this.state.modal_response);
        }
        else{
            var url = myUrl.url_addNewExpedition;
            
            fetch(url, {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Nmex_Name : nmex_nama,
                    Nmex_Code : nmex_kode
                }, console.log(nmex_nama, nmex_kode))
            }).then(response => {
                console.log("sudah request");
                if (response.ok) {
                    this.state.modal_nested = false;
                    this.state.modal_nested_parent = false;
                    this.state.currentPage = this.state.lastData;
                    this.componentDidMount();
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data added";
                    this.state.modal_response = true;
                    this.resetAll();
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
    //edit fix
    editDataExpedition = (nmex_nama, nmex_kode) => () => {
        if(nmex_nama==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Nama expedisi can't be empty!",
                modal_response: true
            });
        }
        else{
            console.log("edit data expedition");
            var url = myUrl.url_editMExpedition;

            fetch(url, {
                method : 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Nmex_Name : nmex_nama,
                    Nmex_Code : nmex_kode
                }, console.log("Nmex nama edited"))
            }).then(response => {
                if (response.ok) {
                    this.state.modal_nested_edit = false;
                    this.state.modal_nested_parent_edit = false;
                    this.state.currentPage = this.state.lastData;
                    this.componentDidMount();
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data save";
                    this.state.modal_response = true;
                    this.resetAll();
                }else{
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data failed to edit";
                    this.state.modal_response = true;
                }
            }).catch(()=>
            {
                this.connectionOut("Can't reach the server", false)
            });
        }
    }

    updateInputValue(evt) {
        console.log(evt.target.name)
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    //reset isi insert dan edit
    resetAll(){
        this.setState({
            inputtedNmexNama: '',
            editNmexNama: ''
        })
    }

    updateSearchValue(evt){
        console.log(evt.target.value);
        this.setState({
            keyword: evt.target.value
        });
    }

    SearchEkspedisi = param => () =>
    {
        this.setState({
            currentPage: 1
                    },() =>{
              
                  this.getTotalExpeditionPage();
              
          });
    } 

    openModalWithItemID(nmex_kode){
        this.setState({
            modal_nested_parent_edit: true,
            
            editNmexKode: nmex_kode
        }, () => console.log(this.state.editcheckbox))
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested_parent_edit: false,
        modal_nested: false,
        modal_nested_edit: false,
        backdrop: true,
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
        this.setState({
            [evt.target.name]: evt.target.value,
            selectedDropdown : evt.target.value,
        });

        if(evt.target.value==="Nmex Kode")
        {
            this.setState({
                searchType:"code",
                displayStatus: 'inline-flex'
            })   
        }

        else if(evt.target.value==="Nmex Nama")
        {
            this.setState({
                searchType:"name",
                displayStatus: 'inline-flex'
            }) 
        }

        else if(evt.target.value === "Show All"){
            this.setState({
                searchType: "all",
                displayStatus: 'none',
                keyword: "",
            },()=>{
                this.componentDidMount();
            });
        }

    }

    render() {
        const currentTodos = this.state.result.data;

        const renderTodos = currentTodos && currentTodos.map((todo) => {
            return<tr>
                <th className="py-3">{todo.Nmex_Code}</th>
                <td className="py-3">{todo.Nmex_Name}</td>
                <td>
                    <Button color="danger" size="sm" onClick={()=>this.openModalWithItemID(todo.Nmex_Code, todo.Nmex_Name)}><MdEdit/></Button>
                </td>
            </tr>
            } ) ;

        return (
            <Page
                title="Ekspedisi"
                breadcrumbs={[{ name: 'ekspedisi', active: true }]}
                className="EkspedisiPage"
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
                                        <DropdownItem value = "Nmex Nama" onClick = {evt => this.updateSelectionValue(evt)}>Nmex Nama</DropdownItem>
                                        <DropdownItem value = "Nmex Kode" onClick = {evt => this.updateSelectionValue(evt)}>Nmex Kode</DropdownItem>
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
                                    {/* console.log(updateSearchValue)   */}
                                </Input>
                                <Button
                                  size="md"
                                  style={{
                                      marginRight: "0.5vw",
                                      display: this.state.displayStatus
                                  }}
                                  onClick={this.SearchEkspedisi()}>
                                    <MdSearch/>
                                </Button>
                                <ButtonGroup>
                                    <Button size="sm" onClick={this.toggle('nested_parent')}>Add</Button>
                                </ButtonGroup>
                                <Modal
                                  isOpen={this.state.modal_nested_parent}
                                  toggle={this.toggle('nested_parent')}
                                  className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Add new ekspedisi
                                    </ModalHeader>
                                    <ModalBody>

                                        <Label>Nmex Nama</Label>
                                        <Input type="nmexnama" value={this.state.inputtedNmexNama} onChange={evt => this.updateInputValue(evt)} name="inputtedNmexNama"/>
                                        
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
                                                <Button color="success" onClick={this.insertNewExpedition(this.state.inputtedNmexNama, this.state.inputtedNmexKode
                                                    )}>
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
                                        Edit Ekspedisi
                                    </ModalHeader>
                                    <ModalBody>
                                            <Label>Nmex Kode</Label>
                                            <Input disabled={this.state.disabledNmexKode} type="nmexkode" value={this.state.editNmexKode} onChange={evt => this.updateInputValue(evt)} name="inputtedNmexKode"/>

                                            <Label>Nmex Nama</Label>
                                            <Input type="nmexnama" value={this.state.inputtedNmexNama} onChange={evt => this.updateInputValue(evt)} name="inputtedNmexNama"/>
                                        
                                            
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
                                                <Button color="success" onClick={this.editDataExpedition( this.state.inputtedNmexNama, this.state.editNmexKode
                                                    )}>
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
                                {/*</ButtonGroup>*/}
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Kode Ekspedisi</th>
                                            <th>Nama Ekspedisi</th>
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
export default EkspedisiPage;
