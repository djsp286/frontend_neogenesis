import React from 'react'
import {  Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Form, FormGroup, Label, Input} from 'reactstrap';
import DetailHargaAdd from './DetailHargaAdd'


class AddModal extends React.Component{


    constructor(props) {
        super(props);       
        this.state = {

            modalAdd : false,
            add : true,

            newSupId : '',
            newSupName : '',
            newProdId : '',
            newProdName : '',

            newGross : '',
            newDisc : '',
            newNetto : '',
            newHja : '',
            newMargin : '',

            newGrossMaster : '',
            newDiscMaster : '',
            newNettoMaster : '',
            newHjaMaster : '',
            newMarginMaster : '',

            newQty :'',
            newKelipatan :''
        }; 
    }

   

    toggleAdd=()=> {
        this.setState(prevState => ({
            modalAdd: !prevState.modalAdd,
            add : !prevState.add
        }));
    }


    newSupId=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newSupId : text
        })
        console.log(text)
    }
    newSupName=(text)=> {
        // this.setState({value: event.value});
        this.setState({
            newSupName : text
        })
        console.log(text)
    }

    newProdId=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newProdId : text
        })
        console.log(text)
    }

    newProdName=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newProdName : text
        })
        console.log(text)
    }

    newGross=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newGross : text
        })
        console.log(text)
    }
    newDisc=(text)=> {
        // this.setState({value: event.value});
        this.setState({
            newDisc : text
        })
        console.log(text)
    }

    newNetto=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newNetto : text
        })
        console.log(text)
    }

    newHja=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newHja : text
        })
        console.log(text)
    }
    newMargin=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newMargin : text
        })
        console.log(text)
    }

    newGrossMaster=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newGrossMaster : text
        })
        console.log(text)
    }
    newDiscMaster=(text)=> {
        // this.setState({value: event.value});
        this.setState({
            newDiscMaster : text
        })
        console.log(text)
    }

    newNettoMaster=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newNettoMaster : text
        })
        console.log(text)
    }

    newHjaMaster=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newHjaMaster : text
        })
        console.log(text)
    }
    newMarginMaster=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newMarginMaster : text
        })
        console.log(text)
    }

    newQty=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newQty : text
        })
        console.log(text)
    }
    newKelipatan=(text)=> {
    // this.setState({value: event.value});
        this.setState({
            newKelipatan : text
        })
        console.log(text)
    } 

    AddNewHarga=()=>{

        //console.log(this.props.supId, this.props.prodId)
        var prodId = this.state.newProdId;
        var prodName = this.state.prodName;

        var gross =  this.state.newGross;
        var disc =  this.state.newDisc;
        var netto = this.state.newNetto;
        var hja =  this.state.newHja;
        var margin =  this.state.newMargin;

        var qty =  this.state.newQty;
        var kelipatan = this.state.newKelipatan;
        
        // var url = `http://10.0.111.52:8086/insertAddData`;
        var url = `https://api.docnet.id/CHCMasterE/insertAddData`;


        // console.log(gross)
        
        var payload ={
            // buylclh_procod : this.state.newProdId, 
            // buylclh_supcode : this.state.newSupId , 
            buylclh_procod : prodId, 
            buylclh_supcode : this.props.supId , 
            buylclh_lgbupri : parseInt(gross),
            buylclh_disc : parseFloat(disc), 
            buylclh_lnbupri : parseInt(netto), 
            buylclh_margin : parseFloat(margin), 
            buylclh_hja: parseInt(hja),

            buylclh_qtypomin : parseInt(qty), 
            buylclh_kelipatan : parseInt(kelipatan)
        }
        
        console.log(payload)

        fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        json: true,
        headers :
            {
                "Content-type":"application/json; charset-UTF-8"
            }
        })
        .then(response => {
            if (response.ok) {               
                            
                console.log('data inserted')
                this.toggleAdd()
                this.setState({                    
                    Edit : true,
                    newGross : '',
                    newDisc : '',
                    newNetto : '',
                    newHja : '',
                    newMargin : '',
                    newQty : '',
                    newKelipatan : ''
                })                
            }
        });     
    }

    render(){
        return(
            <div >
                <Button  size = 'sm' style={{background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=>this.toggleAdd()} >Add</Button>{' '}

                <Modal size = 'lg' isOpen={this.state.modalAdd} toggle={()=>this.toggleAdd()}>
                    <ModalHeader toggle={()=>this.toggleAdd()}>Add</ModalHeader>
                    <ModalBody>
                        {/* <FormGroup row style ={{marginTop : 10, paddingLeft : 9}} >
                            <Label sm={2}>Supplier</Label>
                            <Col sm={10} style={{display : 'flex'}}>
                                <Input  style={{width : '100px'}}  placeholder ={this.props.supId}
                                    // type="text" value={this.state.valueSupId} 
                                    // onChange={this.handleChangeSupId}
                                ></Input>
                                <Input style={{width : '80%'}}  placeholder ={this.props.supName}
                                    //  type="text" value={this.state.valueSupName} 
                                    //  onChange={this.handleChangeSupName}
                                ></Input>
                                
                            </Col>
                        </FormGroup >
                        <FormGroup row style={{paddingLeft : 9}}>
                            <Label sm={2}>Product</Label>
                            <Col sm={10} style={{display : 'flex'}}>
                                <Input  style={{width : '100px'}}  placeholder ={this.props.prodId}
                                    // type="text" value={this.state.valueProdId} 
                                    // onChange={this.handleChangeProdId}
                                ></Input>
                                <Input style={{width : '80%'}}  placeholder ={this.props.prodName}
                                    // type="text" value={this.state.valueProdName} 
                                    // onChange={this.handleChangeProdName}
                                ></Input>
                                
                            </Col>
                        </FormGroup> */}
                        {/* =<FormGroup row style={{paddingLeft : 9}}>
                            <Label sm={2}>Kota</Label>
                            <Col sm={10} style={{display : 'flex'}}>
                                <Input  style={{width : '100px'}} placeholder ={this.props.kotaId}></Input>
                                <Input style={{width : '80%'}} placeholder ={this.props.kotaName}></Input>                                            
                         
                            </Col>
                        </FormGroup> */}

                    <DetailHargaAdd
                        supId ={this.props.supId}
                        supName = {this.props.supName}
                        edit ={this.state.add}
                        dataLokal ={this.state.lokalData}                                
                        dataMaster ={this.state.masterData}
                        
                        lokalGross = {this.state.lokalGross}
                        lokalDisc ={this.state.lokalDisc}
                        lokalNetto={this.state.lokalNetto}
                        lokalHja ={this.state.lokalHja}
                        lokalMargin ={this.state.lokalMargin}
                        
                        // masterGross = {this.state.masterGross}
                        // masterDisc ={this.state.masterDisc}
                        // masterNetto={this.state.masterNetto}
                        // masterHja ={this.state.masterHja}
                        // masterMargin ={this.state.masterMargin}
                    

                         
                        handleChangeSupId ={this.newSupId}
                        handleChangeSupName ={this.newSupName}
                        handleChangeProdId ={this.newProdId}
                        handleChangeProdName ={this.newProdName}

                        handleChangeGross ={this.newGross}
                        handleChangeDisc ={this.newDisc}
                        handleChangeNetto ={this.newNetto}
                        handleChangeHja ={this.newHja}
                        handleChangeMargin ={this.newMargin}

                        // handleChangeGrossMaster ={this.newGrossMaster}
                        // handleChangeDiscMaster ={this.newDiscMaster}
                        // handleChangeNettoMaster ={this.newNettoMaster}
                        // handleChangeHjaMaster ={this.newHjaMaster}
                        // handleChangeMarginMaster ={this.newMarginMaster}

                        handleChangeQty ={this.newQty}
                        handleChangeKelipatan ={this.newKelipatan}
                        
                        AddNewHarga ={this.AddNewHarga}
                        
                        buypack ={this.state.buypack} 
                        sellPack ={this.state.sellPack}
                        moving_Status={this.state.moving_Status} 
                        pro_Sellunit ={this.state.pro_Sellunit} 
                        pro_Ctrlcode ={this.state.pro_Ctrlcode} 
                        qty = {this.state.buylclh_Qtypomin}
                        kelipatan = {this.state.buylclh_Kelipatan}
                    ></DetailHargaAdd>
                    </ModalBody>
                    <ModalFooter >
                        {/* <Button color="primary" onClick={this.toggleAdd}>Save</Button>{' '} */}
                        {/* <Button color="secondary" onClick={this.toggleAdd}>Cancel</Button> */}
                    </ModalFooter>
                </Modal>
            </div>
            
        )
    }
}

export default AddModal;