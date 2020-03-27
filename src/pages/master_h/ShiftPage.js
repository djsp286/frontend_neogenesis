import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, ButtonGroup, InputGroup,
    InputGroupAddon, Form
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdSearch, MdDelete } from 'react-icons/md';

const hostUrl = 'https://api.docnet.id/CHCMasterH/MasterShift'

class ShiftPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            todos:[],
            isLoading: false,
            inputtedName: '',
            searchType:"",
            keyword:"",
            currentPage: 1,
            todosPerPage: 5,
            totalData:0,
            flag:0,
            currentData: 0,
            lastData: 0
        };
    }


    componentDidMount() {
        this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
    }

    //set Current Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value, currentPage: 1
         },() =>{
            this.getListbyPaging(1,this.state.todosPerPage);
        });
        console.log(event.target.value);
        console.log(event.target.name);
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
            ,() =>{ this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);});
        } 
    }

    getListbyPaging(currPage,currLimit)
    {
        const kword = this.state.keyword;
        const urlA = hostUrl+'/getShiftList';
        var payload = {
            offset : (currPage-1)*currLimit,
            limit : currLimit,
            keyword: kword
        };
            const option = {
                method: "POST",
                json: true,
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                  },
                body: JSON.stringify(payload)
            }
            fetch(hostUrl+"/getShiftList",option)
            .then(response => response.json())
            .then(data =>{
                if(this.state.currentPage > data.totalPage){
                    console.log('masuk');
                    this.setState({ currentPage: data.totalPage} ,()=> this.getListbyPaging(this.state.currentPage,this.state.todosPerPage));
                }
                else{
                    this.setState({ result: data, isLoading: false, lastData: data.totalPage})   
                }
            });
        }

    insertMasterShift = (shift_name) => () => {
        var url = hostUrl+'/MShiftBaru';

        fetch(url, {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shift_name: shift_name,
                shift_userid: "1"
            })
        }).then(response => {
            if (response.ok) {
                this.state.modal_nested = false;
                this.state.modal_nested_parent = false;
                this.state.currentPage = this.state.lastData;
                this.componentDidMount();
            }
        });
    }

    setShiftNotActive = (shift_code) => () => {
        var url = hostUrl+'/UpdateShift';
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
                this.componentDidMount();
            }
        });
    }

    openModalWithItemID(code){
        this.setState({
            modal_delete: true,
            activeItemId: code,
        })
    }
    

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
        modal_delete: false,
    };

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };


    render() {
        const { result, isLoading, currentPage, todosPerPage } = this.state;

        const errorMessage =this.state.result.responseMessage;

        const currentRESULT = this.state.result;

        const currentTodos = this.state.result.result;

        const renderTodos = currentTodos &&currentTodos.map((todo) => {
            return<tr>
                <th scope="row">{todo.shift_code}</th>
                <td className="py-3">{todo.shift_name}</td>
                {todo.shift_activeyn === "Y" &&
                    <td className="py-3">
                        <Badge color="success" className="mr-1">Aktif</Badge>
                    </td>}
                {todo.shift_activeyn !== "Y" &&
                    <td className="py-3">
                        <Badge color="danger" className="mr-1">Tidak Aktif</Badge>
                    </td>}
                {todo.shift_activeyn === "Y" &&
                    <td>
                        <Button color="danger" size="sm" onClick={()=>this.openModalWithItemID(todo.shift_code)}><MdHighlightOff /></Button>
                    </td>}
            </tr>
            } ) ;

        return (
            <Page
                title="Shift"
                breadcrumbs={[{ name: 'shift', active: true }]}
                className="ShiftPage"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardHeader className="d-flex justify-content-between">
                                {/*<ButtonGroup>*/}
                                <Input
                                    type="search"
                                    className="cr-search-form__input"
                                    placeholder="Search by Shift Name"
                                    onKeyPress={(e) => this.enterPressed(e,false)}
                                    style={{
                                        marginRight: "0.5vw",
                                    }}
                                    onChange={evt => this.updateSearchValue(evt)}>
                                </Input>
                                <Button
                                  size="md"
                                  style={{
                                      marginRight: "0.5vw"
                                  }}
                                  onClick={this.SearchbyShiftName()}>
                                    <MdSearch/>
                                </Button>
                                {/*</ButtonGroup>*/}
                                {/*<ButtonGroup className="mr-2">*/}
                                <Button
                                  style={{
                                      marginRight: "0.5vw",
                                      display: "inline-flex",
                                      whiteSpace: "nowrap"
                                  }}
                                  color="secondary"
                                  size="sm">Print Record
                                </Button>
                                <Button size="sm" onClick={this.toggle('nested_parent')}>Tambah</Button>
                                <Modal
                                  isOpen={this.state.modal_nested_parent}
                                  toggle={this.toggle('nested_parent')}
                                  className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Tambah Shift
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Shift</Label>
                                        <Input type="namashift" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namashift" placeholder="Nama Shift" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.toggle('nested')}>
                                            Simpan
                                        </Button>
                                        <Modal
                                          isOpen={this.state.modal_nested}
                                          toggle={this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={this.insertMasterShift(this.state.inputtedName)}>
                                                    Ya
                                                </Button>{' '}
                                                <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested')}>
                                                    Tidak
                                                </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                            Batal
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                                <Modal
                                  isOpen={this.state.modal_delete}
                                toggle={this.toggle('delete')}>
                                    <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
                                    <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.setShiftNotActive(this.state.activeItemId)}>
                                            Ya
                                        </Button>{' '}
                                        <Button
                                          color="secondary"
                                          onClick={this.toggle('delete')}>
                                            Tidak
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                                {/*</ButtonGroup>*/}
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Kode Shift</th>
                                            <th>Nama Shift</th>
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
    <InputGroupAddon addonType="prepend">Data per Page</InputGroupAddon>
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

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateSearchValue(evt){
        console.log(evt.target.value);
        this.setState({
            keyword: evt.target.value
        });
    }

    SearchbyShiftName = param => () =>
    {
        var searchByShiftName = this.state.searchByShiftName;
        const kword = this.state.keyword;
        
        this.setState({
            currentPage: 1
                    },() =>{
              
                  this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
              
          });
    } 
}
export default ShiftPage;
