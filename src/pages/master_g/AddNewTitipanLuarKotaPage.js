import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from 'dateformat';
import * as myUrl from '../urlLinkMasterG';
import React from 'react';
import Select from 'react-select';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, ButtonGroup, InputGroup,
    InputGroupAddon, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown, FormGroup
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdSearch, MdDelete, MdEdit, MdCheckBox, MdArrowBack, MdAutorenew} from 'react-icons/md';

class AddNewTitipanLuarKotaPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            todos:[],
            isLoading: false,
            listPenitip:[],
            inputtedTanggalTitip: dateFormat(new Date(), "yyyy-mm-dd"),
            viewTanggalTitip : new Date(),
            inputtedOutletKode: '',
            inputtedSealedYN: '',
            inputtedOutletName: '',
            inputtedNIPPenitip: '',
            inputtedPenitipName: '',
            inputtedDepartemen: '',
            inputtedStatus: '',
            inputtedNamaBarang: '',
            inputtedJumlahBarang: '',
            inputtedSatuanBarang: '',
            editNamaBarang: '',
            editJumlahBarang: '',
            editSatuanBarang: '',
            searchType:"Mobil_ID",
            expedisi: "FeeExp_KodeEx",
            area: "FeeExp_Area",
            keyword:"",
            currentPage: 1,
            todosPerPage: 5,
            totalData:0,
            flag:0,
            currentData: 0,
            lastData: 0,
            disabledTglKIR: true,
            disabledbNoPolisi: true,
            disabledJenisMobil: true,
            isChecked: true,
            displayStatus: "none",
            selectedOption: null,
            currentPoint: {},
            editPoint: {},
        };
    }

    // componentDidMount() {
    //     this.getPenitip();
    // }

    getPenitip(){
        const kword = this.state.inputtedNIPPenitip;
        const currLimit = this.state.todosPerPage;
        const url=myUrl.url_getNmKaryawan;
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
              },
            body: JSON.stringify({
                Kry_NIP : kword
            })
        };
        fetch(url ,option)
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                this.setState({
                    inputtedNIPPenitip: data.data.Kry_NIP,
                    inputtedPenitipName: data.data.Kry_Nama,
                    inputtedDepartemen: data.data.Dpt_Name
                }, ()=>console.log(this.state.inputtedNIPPenitip, this.state.inputtedPenitipName, this.state.inputtedDepartemen))
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    //function connection out
    connectionOut(message, render){
        if(render){
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
                modal_nested_parent_add_barang: false,
                modal_nested_parent_edit: false,
                modal_nested_edit: false,
                modal_nested_save: false,
                modal_nested_parent_save: false,
                modal_nested: false,
                modal_nested_add_barang: false,
                backdrop: true,
                modal_response: true,
                searchType:"Show_All",
                responseHeader: "CONNECTION ERROR",
                responseMessage: message
            },  () => this.pagecount())
        }else{
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
                modal_nested_parent_add_barang: false,
                modal_nested_parent_edit: false,
                modal_nested_edit: false,
                modal_nested_save: false,
                modal_nested_parent_save: false,
                modal_nested_add_barang: false,
                modal_nested: false,
                backdrop: true,
                modal_response: true,
                responseHeader: "CONNECTION ERROR",
                responseMessage: message
            })
        }
    }

    //untuk tanggal titip
    handleChange = date => {
        this.setState({
          inputtedTanggalTitip: dateFormat(date, "yyyy-mm-dd"),
          viewTanggalTitip: date
        }, () => console.log("tgl titip: " + this.state.inputtedTanggalTitip));
    };

    //update / edit table dalam add
    UpdateInputTable(evt, field, name) {
        let Point = {};
        if (name === "current") {
            Point = { ...this.state.currentPoint };
        } else {
            Point = { ...this.state.editPoint };
        }

        Point[field] = evt.target.value;
        this.setState({
        [`${name}Point`]: Point,
        [evt.target.name]: evt.target.value
        });
    }

    insertMasterTitipanLuarKota = (TglTitip, tujuan, nip, departemen, sealedyn) => () => {
        var dataDetail = this.state.result;
        if(TglTitip == ""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Tanggal titip can't be empty!",
                modal_response: true
            });
            
            console.log(this.state.modal_response);
        }
        else if(tujuan==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Tujuan can't be empty!",
                modal_response: true
            });
        }
        else if(sealedyn==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"SealedYN can't be empty!",
                modal_response: true
            });
        }
        else if(nip==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Penitip can't be empty!",
                modal_response: true
            });
        }
        else if(departemen==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Departemen can't be empty!",
                modal_response: true
            });
        }
        else{   
            console.log("insert masuk");
            var url = myUrl.url_saveNewTitipanLK;
            var bod = JSON.stringify( {
                dataHeader : {
                    HeaderTitipanLK_TglTitip: TglTitip,
                    HeaderTitipanLK_TitipHComco: tujuan,
                    HeaderTitipanLK_TitipHNip: nip,
                    HeaderTitipanLK_TitipHDept: departemen,
                    HeaderTitipanLK_TitipHSealedYN: sealedyn,
                    HeaderTitipanLK_TitipHGudangID: "254",
                    HeaderTitipanLK_TitipHUserID: "1"
                 }, 
                dataDetail
            })
            console.log(bod)

            fetch(url, {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( {
                    dataHeader : {
                        HeaderTitipanLK_TglTitip: TglTitip,
                        HeaderTitipanLK_TitipHComco: tujuan,
                        HeaderTitipanLK_TitipHNip: nip,
                        HeaderTitipanLK_TitipHDept: departemen,
                        HeaderTitipanLK_TitipHSealedYN: sealedyn,
                        HeaderTitipanLK_TitipHGudangID: "254",
                        HeaderTitipanLK_TitipHUserID: "1"
                    }, 
                    dataDetail
            })
            }).then(response => {
                console.log("sudah request");
                if (response.ok) {
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data added";
                    this.state.modal_response = true;
                    this.resetAll();
                    this.resetModal();
                    this.backTo();
                    //a href=""
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

    //function back to halaman utama
    backTo(){
        window.location.href = "http://localhost:3000/titipan-luar-kota";
    }

    resetAll(){
        this.setState({
            inputtedTanggalTitip: new Date(),
            inputtedOutletKode: '',
            inputtedSealedYN: '',
            inputtedOutletName: '',
            inputtedNIPPenitip: '',
            inputtedDepartemen: '',
            inputtedStatus: '',
            inputtedPenitipName: ''
        })
    }

    resetModal(){
        this.setState({
            inputtedNamaBarang: '',
            inputtedJumlahBarang: '',
            inputtedSatuanBarang: '',
            editNamaBarang: '',
            editJumlahBarang: '',
            editSatuanBarang: ''
        })
    }

    updateInputValue(evt) {
        console.log(evt.target.name)
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    updateCheckedValue(evt) {
        if(evt.target.checked==true){
            this.setState({
                inputtedBoxYN : 'Y',
                disabledTglKIR: false
            }, () => console.log(this.state.inputtedBoxYN))

        }

        else{
            this.setState({
                inputtedBoxYN : 'N',
                disabledTglKIR: true
            }, () => console.log(this.state.inputtedBoxYN))
        }
    }

    updateSearchValue(evt){
        console.log(evt.target.value);
        this.setState({
            keyword: evt.target.value
        });
    }

    //dropdown add
    updateOptionSelected(type, evt){
        if(type === "penitip"){
            const penitip_array = evt.value.split(" - ")
            this.setState({
                inputtedNIPPenitip: penitip_array[0],
                inputtedPenitipName: penitip_array[1]
            })
        }
    } 

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested_parent_add_barang: false,
        modal_nested_parent_edit: false,
        modal_nested_edit: false,
        modal_nested_save: false,
        modal_nested_parent_save: false,
        modal_nested_add_barang: false,
        modal_nested: false,
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

    toggleEdit = (modalType, todo) => () => {
        console.log(modalType);
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
            editPoint:{...this.state.editPoint, "id": todo} 
        });
    };

    //untuk save update poin
    updatePointTabel = (todo, aktifyn = null) => (event) => {
        console.log(todo);
        todo["DetailTitipanLK_GudangID"] = "254";
        todo["DetailTitipanLK_UserID"] = "1";
        if ((event.target.name).includes('Tambah')) {
            console.log("tambah");
            todo["id"] = this.state.result.length + 1;
            this.setState(prevState => ({
                result: [...prevState.result, todo],
                modal_nested: false,
                modal_nested_parent: false,
            }));
            this.resetModal();
        } 
        else if ((event.target.name).includes('Edit')) {
            console.log("edit");
            this.setState(prevState => ({
                result: prevState.result.map(
                    el => el.id === todo.id ? { ...todo } : el
                ), modal_nested_edit: false,
                modal_nested_parent_edit: false
            }));
            this.resetModal();
        }
    }

    //search nip penitip
    enterPressed= (event,search) =>{
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            event.preventDefault();
            this.getPenitip();
        } 
    }

    searchPenitip = param => () =>
    {
        this.getPenitip();
    } 

    render() {
        const currentTodos = this.state.result;

        const renderTodos = currentTodos && currentTodos.map((todo) => {
            return<tr>
                <td className="py-3">{todo.id}</td>
                <td className="py-3">{todo.DetailTitipanLK_NamaBarang}</td>
                <td className="py-3">{todo.DetailTitipanLK_Qty}</td>
                <td className="py-3">{todo.DetailTitipanLK_TitipDUnit}</td>
                <td>
                    <Button color="danger" size="sm" onClick={this.toggleEdit("nested_parent_edit", todo.id)}><MdEdit/></Button>
                </td>
            </tr>
            } ) ;

        return (    
            <Page
                title="Add New Titipan Luar Kota"
                breadcrumbs={[{ name: 'addnewtitipanluarkota', active: true }]}
                className="AddNewTitipanLuarKotaPage"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardHeader>
                                <Button color="primary" size="sm" a href="http://localhost:3000/titipan-luar-kota"><MdArrowBack/>Back</Button>
                                <Modal
                                  isOpen={this.state.modal_nested_parent}
                                  toggle={this.toggle('nested_parent')}
                                  className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Add new barang titipan luar kota
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Barang</Label>
                                        <Input value={this.state.inputtedNamaBarang} type="namabarang" onChange={evt => this.UpdateInputTable(evt,"DetailTitipanLK_NamaBarang" ,"current")} name="inputtedNamaBarang"/>

                                        <Label>Jumlah Barang</Label>
                                        <Input value={this.state.inputtedJumlahBarang} type="jumlahbarang" onChange={evt => this.UpdateInputTable(evt, "DetailTitipanLK_Qty", "current")} name="inputtedJumlahBarang"/>

                                        <Label>Satuan</Label>
                                        <Input value={this.state.inputtedSatuanBarang} type="satuanbarang" onChange={evt => this.UpdateInputTable(evt, "DetailTitipanLK_TitipDUnit", "current")} name="inputtedSatuanBarang"/>
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
                                                <Button color="success" name="Tambah" onClick={this.updatePointTabel({ ...this.state.currentPoint })} >
                                                    Yes
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested')}>
                                                    Tidak
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
                                  isOpen={this.state.modal_nested_parent_edit}
                                  toggle={this.toggle('nested_parent_edit')}
                                  className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent_edit')}>
                                        Edit barang titipan luar kota
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Barang</Label>
                                        <Input value={this.state.editNamaBarang} type="editnamabarang" onChange={evt => this.UpdateInputTable(evt,"DetailTitipanLK_NamaBarang" ,"edit")} name="editNamaBarang"/>

                                        <Label>Jumlah Barang</Label>
                                        <Input value={this.state.editJumlahBarang} type="editjumlahbarang" onChange={evt => this.UpdateInputTable(evt, "DetailTitipanLK_Qty", "edit")} name="editJumlahBarang"/>

                                        <Label>Satuan</Label>
                                        <Input value={this.state.editSatuanBarang} type="editsatuanbarang" onChange={evt => this.UpdateInputTable(evt, "DetailTitipanLK_TitipDUnit", "edit")} name="editSatuanBarang"/>
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
                                                <Button color="success" name="Edit" onClick={this.updatePointTabel({ ...this.state.editPoint })} >
                                                    Yes
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested_edit')}>
                                                    Tidak
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
                                        <Button color="success" onClick={ () => { this.setState({ modal_response: false, modal_nested_edit:false}) } }>Ok</Button>
                                    </ModalFooter>
                                </Modal>
                            </CardHeader>
                            <CardBody>
                                <tr>
                                    <td className="py-3"  style={{width: "15%"}}>
                                        <label>Tanggal</label>  
                                    </td>    
                                    <td className="py-3">
                                        <DatePicker
                                            selected={this.state.viewTanggalTitip}
                                            type="tanggaltitip"
                                            value={this.state.viewTanggalTitip}
                                            onChange={this.handleChange} 
                                            name="inputtedTanggalTitip" 
                                        /> 
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width: "40%"}} >
                                        <Label>Kode Tujuan</Label>
                                    </td>
                                    <td style={{width: "60%"}}>
                                        <Input value={this.state.inputtedOutletKode} type="tujuan" onChange={evt => this.updateInputValue(evt)} name="inputtedOutletKode" placeholder="Harus 3 kata!"/>    
                                    </td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: "40%"}}>
                                        <Input
                                            type="search"
                                            className="cr-search-form__input"
                                            placeholder="NIP Penitip"
                                            value={this.state.inputtedNIPPenitip}
                                            name = "inputtedNIPPenitip"
                                            // onKeyPress={(e) => this.enterPressed(e,false)}
                                            style={{
                                                //marginRight: "0.5vw",
                                                //display: this.state.displayStatus
                                            }}
                                            onChange={evt => this.updateInputValue(evt)}>
                                        </Input>
                                    </td>
                                    <Button
                                            size="md"
                                            style={{
                                                //marginRight: "0.5vw",
                                                //display: this.state.displayStatus
                                            }}
                                            onClick={this.searchPenitip()}>
                                            <MdSearch/>
                                        </Button>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: "40%"}} >
                                        <Label>Nama Penitip</Label>
                                    </td>
                                    <td style={{width: "60%"}}>
                                        <Input disabled="true" value={this.state.inputtedPenitipName} type="namapenitip" onChange={evt => this.updateInputValue(evt)} name="inputtedOutletKode"/> 
                                    </td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: "40%"}} >
                                        <Label>Departemen</Label>
                                    </td>
                                    <td style={{width: "60%"}}>
                                        <Input disabled="true" value={this.state.inputtedDepartemen} type="departemen" onChange={evt => this.updateInputValue(evt)} name="inputtedDepartemen"/>
                                    </td>
                                </tr>
                                <br/>
                                <tr>
                                    <td style={{width: "40%"}} >
                                        <Label>SealedYN</Label>
                                    </td>
                                    <td style={{width: "60%"}}>
                                        <Input value={this.state.inputtedSealedYN} type="sealedYN" onChange={evt => this.updateInputValue(evt)} name="inputtedSealedYN" placeholder="'Y' atau 'N'"/>    
                                    </td>
                                </tr>
                                <Table responsive>
                                    <thead>
                                        <br/>
                                        <Button size="sm" onClick={this.toggle('nested_parent')}>Add</Button>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama Barang</th>
                                            <th>Jumlah</th>
                                            <th>Satuan</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTodos}
                                    </tbody>
                                </Table> 
                                    <Button color="info" onClick={this.toggle('nested_save')}>
                                            Save
                                        </Button>
                                        <Modal
                                          isOpen={this.state.modal_nested_save}
                                          toggle={this.toggle('nested_save')}
                                        >
                                            <ModalHeader>Confirmation</ModalHeader>
                                            <ModalBody>Are you sure to save the data?</ModalBody>
                                            <ModalFooter>
                                                <Button color="success" onClick={this.insertMasterTitipanLuarKota(this.state.inputtedTanggalTitip,
                                                    this.state.inputtedOutletKode, this.state.inputtedNIPPenitip, this.state.inputtedDepartemen, 
                                                    this.state.inputtedSealedYN
                                                )} >
                                                    Yes
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    a href="http://localhost:3000/tambah-titipan-luar-kota">
                                                    Tidak
                                                </Button>
                                            </ModalFooter>
                                        </Modal>
                                <hr/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }

    
}
export default AddNewTitipanLuarKotaPage;
//untuk amp
//export const config = {amp : true}
