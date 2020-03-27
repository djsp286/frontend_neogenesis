import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from 'dateformat';
import React from 'react';
import * as myUrl from '../urlLinkMasterG';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, ButtonGroup, InputGroup,
    InputGroupAddon, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown, FormGroup
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdSearch, MdDelete, MdEdit, MdCheckBox, MdArrowBack, MdDesktopWindows} from 'react-icons/md';

class TitipanLuarKotaDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            resultDetail: [],
            todos:[],
            isLoading: false,
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
            selectedDropdown: "Show All",
            selectedDropdown2: "Choose",
            selectedDropdown3: "Choose",
            disabledTglKIR: true,
            disabledbNoPolisi: true,
            disabledJenisMobil: true,
            isChecked: true,
            displayStatus: "none",
            value: 0,
            currActiveId : this.props.currActiveId,
            currTanggal: this.props.currTanggal,
            currKodeTujuan: this.props.currKodeTujuan,
            currTujuan: this.props.currTujuan,
            currNIP : this.props.currNIP,
            currPenitip: this.props.currPenitip,
            currDepartemen: this.props.currDepartemen,
            currStatus: this.props.currStatus
        };
    }

    componentDidMount() {
        // this.getDataUtama();
        this.getDataDetail();
    }

    //function connection out
    connectionOut(message, render){
        if(render){
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
                modal_nested_parent_edit: false,
                modal_nested_parent_detail: false,
                modal_nested: false,
                modal_nested_edit: false,
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
                modal_nested_parent_edit: false,
                modal_nested_parent_detail: false,
                modal_nested: false,
                modal_nested_edit: false,
                backdrop: true,
                modal_response: true,
                responseHeader: "CONNECTION ERROR",
                responseMessage: message
            })
        }
    }

    // getDataUtama(){
    //     const url='http://10.0.111.41:8084/getHeaderTitipanLK';
    //     const option = {
    //         method: "POST",
    //         json: true,
    //         headers: {
    //             "Content-Type": "application/json;charset=UTF-8"
    //           },
    //         body: JSON.stringify({
    //         })
    //     };
    //     fetch(url ,option)
    //         .then(response => response.json())
    //         .then(data =>{
    //             console.log(data)
    //             this.setState({
    //                 viewNoTitipan: data.HeaderTitipanLK_RunningID,
    //                 viewTanggal: data.HeaderTitipanLK_TglTitip,
    //                 viewKodeTujuan: data.HeaderTitipanLK_TitipHComco,
    //                 viewTujuan : data.HeaderTitipanLK_OutName,
    //                 viewNIP : data.HeaderTitipanLK_TitipHNip,
    //                 viewPenitip : data.HeaderTitipanLK_KryNama,
    //                 viewDepartemen : data.HeaderTitipanLK_TitipHDept,
    //                 viewSealedYN : data.HeaderTitipanLK_TitipHSealedYN
    //             }, ()=>console.log(this.state.viewTanggal, this.state.viewKodeTujuan, this.state.viewTujuan,
    //                     this.state.viewNIP, this.state.viewPenitip, this.state.viewDepartemen, this.state.viewSealedYN
    //                 ))
    //         }, ()=> this.connectionOut("Can't reach the server", false));
    // }

    getDataDetail(){
        const notitip = this.state.currActiveId;
        const url=myUrl.url_getDetailTitipanLK+'+notitip+'/+254;
        console.log(notitip);
        fetch(url)
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                this.setState({
                    resultDetail: data.data
                })
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    updateInputValue(evt) {
        console.log(evt.target.name)
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }
    
    //function print
    printTitipan(id){
        const url=myUrl.url_printTitipanLK;
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/pdf;",
                "Content-Disposition": "attachment; filename=file.pdf"
              },
            body: JSON.stringify( {
                dataHeader:
                    {
                        HeaderTitipanLK_Nomor : id
                    }
            })
        };
      
        fetch(url ,option)
            .then(response => {
                const filename = response.headers.get('Content-Disposition').split('filename=')[1]
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob)
                    let a = document.createElement('a')
                    a.href = url
                    a.download = filename
                    a.click();
                })  
            })
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested_parent_edit: false,
        modal_nested_parent_detail: false,
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

    render() {
        const currentTodos = this.state.resultDetail;

        const renderTodos = currentTodos && currentTodos.map((todo) => {
            return<tr>
                <td className="py-3">{todo.id}</td>
                <td className="py-3">{todo.DetailTitipanLK_NamaBarang}</td>
                <td className="py-3">{todo.DetailTitipanLK_Qty}</td>
                <td className="py-3">{todo.DetailTitipanLK_TitipDUnit}</td>
            </tr>
            } ) ;

        return (    
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardHeader>
                                <Button color="primary" size="sm" a href="http://localhost:3000/titipan-luar-kota"><MdArrowBack/>Back</Button>
                            </CardHeader>
                            <CardBody>
                                <tr>
                                    <td className="py-3"  style={{width: "15%"}}>
                                        <label>No. Titipan</label>  
                                    </td>    
                                    <td className="py-3">
                                        <input disabled={this.state.disabledbNoPolisi} type="expedisi" value={this.state.currActiveId} onChange={evt => this.updateInputValue(evt)} name="inputtedExpedisi"/> 
                                    </td>
                                    {/* <td  style={{width: "25%"}}></td>
                                    <td className="py-3" style={{width: "15%"}}>
                                        <label>Status</label>  
                                    </td>    
                                    <td className="py-3">
                                        <input disabled={this.state.disabledbNoPolisi} type="expedisi" value={this.state.detailid} onChange={evt => this.updateInputValue(evt)} name="inputtedExpedisi"/> 
                                    </td> */}
                                </tr>
                                <tr>
                                    <td className="py-3"  style={{width: "15%"}}>
                                        <label>Status</label>  
                                    </td>    
                                    <td className="py-3">
                                        <input disabled={this.state.disabledbNoPolisi} type="expedisi" value={this.state.currStatus} onChange={evt => this.updateInputValue(evt)} name="inputtedExpedisi"/> 
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3"  style={{width: "15%"}}>
                                        <label>Tanggal</label>  
                                    </td>    
                                    <td className="py-3">
                                        <input disabled={this.state.disabledbNoPolisi} type="expedisi" value={this.state.currTanggal} onChange={evt => this.updateInputValue(evt)} name="inputtedExpedisi"/> 
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3"  style={{width: "15%"}}>
                                        <label>Tujuan</label>  
                                    </td>    
                                    <td className="py-3">
                                        <input disabled={this.state.disabledbNoPolisi} type="expedisi" value={this.state.currKodeTujuan} onChange={evt => this.updateInputValue(evt)} name="inputtedExpedisi"/> 
                                    </td>
                                    <td className="py-3" style={{width: "60%"}}>
                                        <input disabled={this.state.disabledbNoPolisi} type="expedisi" value={this.state.currTujuan} onChange={evt => this.updateInputValue(evt)} name="inputtedExpedisi"/> 
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3"  style={{width: "15%"}}>
                                        <label>Penitip</label>  
                                    </td>    
                                    <td className="py-3">
                                        <input disabled={this.state.disabledbNoPolisi} type="expedisi" value={this.state.currNIP} onChange={evt => this.updateInputValue(evt)} name="inputtedExpedisi"/> 
                                    </td>
                                    <td className="py-3">
                                        <input disabled={this.state.disabledbNoPolisi} type="expedisi" value={this.state.currPenitip} onChange={evt => this.updateInputValue(evt)} name="inputtedExpedisi"/> 
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3"  style={{width: "15%"}}>
                                        <label>Departemen</label>  
                                    </td>    
                                    <td className="py-3">
                                        <input disabled={this.state.disabledbNoPolisi} type="expedisi" value={this.state.currDepartemen} onChange={evt => this.updateInputValue(evt)} name="inputtedExpedisi"/> 
                                    </td>
                                </tr>
                                <Table responsive>
                                    <thead>
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
                                    <br/>
                                    <Button color="secondary" size="sm" onClick={() => this.printTitipan(this.state.currActiveId)}>Print</Button>
                                </Table> 
                                <hr/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
        );
    }

    
}
export default TitipanLuarKotaDetailPage;
//untuk amp
//export const config = {amp : true}
