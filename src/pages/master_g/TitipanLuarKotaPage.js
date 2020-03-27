import Page from 'components/Page';
import "react-datepicker/dist/react-datepicker.css";
import React from 'react';
import {
    Button, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, ButtonGroup, InputGroup,
    InputGroupAddon, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown
} from 'reactstrap';
import * as myUrl from '../urlLinkMasterG';
import { MdSearch} from 'react-icons/md';
import TitipanLuarKotaDetailPage from './TitipanLuarKotaDetailPage';

class TitipanLuarKotaPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            todos:[],
            isLoading: false,
            searchType:"all",
            expedisi: "FeeExp_KodeEx",
            area: "FeeExp_Area",
            detailTitipan: '',
            keyword:"",
            currentPage: 1,
            todosPerPage: 5,
            totalData:0,
            flag:0,
            currentData: 0,
            lastData: 0,
            currActiveId: "",
            currTanggal: "",
            currKodeTujuan: "",
            currTujuan: "",
            currNIP : "",
            currPenitip: "",
            currDepartemen: "",
            currStatus: "",
            selectedDropdown: "Show All",
            disabledTglKIR: true,
            disabledbNoPolisi: true,
            disabledJenisMobil: true,
            isChecked: true,
            displayStatus: "none",
            value : 0
        };
    }

    componentDidMount() {
        this.getTotalTitipanLuarKotaPage();
    }

    //function connection out
    connectionOut(message, render){
        if(render){
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
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
            this.getTotalTitipanLuarKotaPage();
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
                this.getTotalTitipanLuarKotaPage();
            });
        } 
    }

    getTotalTitipanLuarKotaPage(){
        const kword = this.state.keyword;
        const currLimit = this.state.todosPerPage; 

        const urlA=myUrl.url_getTotalHeaderTitipanLKPage;
        var payload = {
            keyword: kword,
            limit : currLimit.toString(),
            type : this.state.searchType
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
        
            const urlA=myUrl.url_getHeaderTitipanLK;
            var payload = {
                offset : ((currPage-1)*currLimit).toString(),
                limit : currLimit.toString(),
                keyword : kword,
                type : this.state.searchType
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
                    console.log(data.data)
                    this.setState({ result: data.data, isLoading: false})
                }, ()=> this.connectionOut("Can't reach the server", false));
    }

    updateInputValue(evt) {
        console.log(evt.target.name)
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    updateSearchValue(evt){
        console.log(evt.target.value);
        this.setState({
            keyword: evt.target.value
        });
    }

    SearchTitipanLuarKota = param => () =>
    {
        this.setState({
            currentPage: 1
                    },() =>{
                  this.getTotalTitipanLuarKotaPage();
              
          });
    } 

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
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
            selectedDropdown : evt.target.value
        });

        if(evt.target.value==="No. Titipan")
        {
            this.setState({
                searchType:"noTitipan",
                displayStatus: 'inline-flex'
            })   
        }

        else if(evt.target.value==="NIP Penitip"){
            this.setState({
                searchType:"nipPenitip",
                displayStatus: 'inline-flex'
            })
        }

        else if(evt.target.value === "Show All"){
            this.setState({
                searchType: "all",
                displayStatus: 'none',
                keyword: ""
            },()=>{
                this.componentDidMount();
            });
        }
    }

    //balik ke page js awal
    showPage =()=>{
        this.setState({
            value:0
        })
    }

    //untuk ngubah value buat nampilin detail
    showDetail = (id, status, tanggal, nip, kodetujuan, tujuan, penitip, departemen) =>{
        this.setState({
            value     : 1,
            currActiveId : id,
            currTanggal: tanggal,
            currStatus : status,
            currNIP: nip,
            currTujuan : tujuan,
            currKodeTujuan: kodetujuan,
            currPenitip : penitip,
            currDepartemen: departemen
        }, () => console.log(this.state.value, this.state.currActiveId))
    }

    render() {
        //const {currentTodos, value} = this.state;
        const currentTodos = this.state.result;
        const value = this.state.value;

        const renderTodos = currentTodos && currentTodos.map((todo) => {
            return<tr>
                <th scope="row" value={this.state.currActiveId}>{todo.HeaderTitipanLK_Nomor}</th>
                <td className="py-3" value={this.state.currStatus}>{todo.HeaderTitipanLK_TitipHFlag}</td>
                <td className="py-3" value={this.state.currTanggal}>{todo.HeaderTitipanLK_TglTitip}</td>
                <td className="py-3" value={this.state.currNIP}>{todo.HeaderTitipanLK_TitipHNip}</td>
                <td>
                    {/* <Button color="info" size="sm" a href="http://localhost:3000/titipan-luar-kota-detail">
                        Detail
                    </Button> */}
                    <Button color="info" size="sm" onClick={()=>this.showDetail(todo.HeaderTitipanLK_Nomor, todo.HeaderTitipanLK_TitipHFlag,
                            todo.HeaderTitipanLK_TglTitip, todo.HeaderTitipanLK_TitipHNip, todo.HeaderTitipanLK_TitipHComco,
                            todo.HeaderTitipanLK_OutName, todo.HeaderTitipanLK_KryNama, todo.HeaderTitipanLK_TitipHDept
                        )}>Detail</Button>
                </td>
            </tr>
            } ) ;

        return (
            <Page
                title="Titipan Luar Kota"
                breadcrumbs={[{ name: 'titipanluarkota', active: true }]}
                className="TitipanLuarKotaPage"
            >
                {value===0 &&
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
                                            <DropdownItem value = "No. Titipan" onClick = {evt => this.updateSelectionValue(evt)}>No. Titipan</DropdownItem>
                                            <DropdownItem value = "Tujuan" onClick = {evt => this.updateSelectionValue(evt)}>Tujuan</DropdownItem>
                                            <DropdownItem value = "NIP Penitip" onClick = {evt => this.updateSelectionValue(evt)}>NIP Penitip</DropdownItem>
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
                                    onClick={this.SearchTitipanLuarKota()}>
                                        <MdSearch/>
                                    </Button>
                                    <ButtonGroup>
                                        <Button size="sm" a href="http://localhost:3000/tambah-titipan-luar-kota">Add</Button>
                                    </ButtonGroup>
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
                                                <th>No. Titipan</th>
                                                <th>Status</th>
                                                <th>Tanggal</th>
                                                <th>NIP Penitip</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderTodos}
                                            {/* {currentTodos.map(todo =>
                                            <tr>
                                                <th scope="row" value={this.state.currActiveId}>{todo.HeaderTitipanLK_Nomor}</th>
                                                <td className="py-3">{todo.HeaderTitipanLK_TitipHFlag}</td>
                                                <td className="py-3">{todo.HeaderTitipanLK_TglTitip}</td>
                                                <td className="py-3">{todo.HeaderTitipanLK_TitipHNip}</td> 
                                                <Button color="info" size="sm" onClick={()=>this.showDetail(todo.HeaderTitipanLK_Nomor)}></Button> 
                                            </tr>
                                            )} */}
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
                                                width: '50px',
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
                }
                {value === 1 && <Page> 
                    <TitipanLuarKotaDetailPage  func = {()=>this.showPage()} currActiveId={this.state.currActiveId}
                        currStatus={this.state.currStatus} currTanggal={this.state.currTanggal} currNIP={this.state.currNIP}
                        currKodeTujuan={this.state.currKodeTujuan} currTujuan={this.state.currTujuan} currPenitip={this.state.currPenitip}
                        currDepartemen={this.state.currDepartemen}
                    />
                </Page>
                }
            </Page>
        );
    }

    
}
export default TitipanLuarKotaPage;
//untuk amp
//export const config = {amp : true}
