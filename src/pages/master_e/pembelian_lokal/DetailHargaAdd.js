import React from 'react'
import {  Alert, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Form, FormGroup, Label, Input} from 'reactstrap';
import { MdTransferWithinAStation } from 'react-icons/md';
import { isNull } from 'util';


class DetailHargaAdd extends React.Component{

    constructor(props) {
        super(props);       
        this.state = {
            // lokalGross : props.lokalGross,
            // lokalDiscount : props.lokalDiscount,
            // lokalNetto : props.lokalNetto,
            // lokalHja : props.lo
            edit : props.edit,
            dataLokal : props.dataLokal,

            valueSupId : '',
            valueSupName : '',
            valueProdId : '',
            valueProdName : '',

            valueGross : '',
            valueDisc : '',
            valueNetto : '',
            valueHja : '',
            valueMargin : '',

            // valueGrossMaster : '',
            // valueDiscMaster : '',
            // valueNettoMaster : '',
            // valueHjaMaster : '',
            // valueMarginMaster : '',
            
            valueQty : '',
            valueKelipatan : '',

            errorVisible : false ,
            errorMessage : ''
        };
        
        
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.edit != prevProps.edit){
            this.setState({
                edit: this.props.edit
            });
        }
        if(this.props.dataLokal != prevProps.dataLokal){
            this.setState({
                dataLokal: this.props.dataLokal
            });
        }  
        // if(this.props.lokalGross != prevProps.lokalGross){
        //     this.setState({
        //         lokalGross: this.props.lokalGross
        //     });
        // }  
        // if(this.props.valueGross != prevProps.valueGross){
        //     this.setState({
        //         valueGross: this.props.valueGross
        //     });
        // }       
    }


    handleChangeSupId=(event)=> {
        this.setState({
            valueSupId: event.target.value
        },()=>{
            this.props.handleChangeSupId(this.state.valueSupId)            
        });
    
    }
    handleChangeSupName=(event)=> {
        this.setState({
            valueSupName: event.target.value
        },()=>{
            this.props.handleChangeSupName(this.state.valueSupName)            
        });
    
    }
    handleChangeProdId=(event)=> {
        this.setState({
            valueProdId: event.target.value
        },()=>{
            this.props.handleChangeProdId(this.state.valueProdId)
        });
    }
    handleChangeProdName=(event)=> {
        this.setState({
            valueProdName: event.target.value
        },()=>{
            this.props.handleChangeProdName(this.state.valueProdName)
        });
    }

    //harga lokal
    handleChangeGross=(event)=> {
        this.setState({
            valueGross: event.target.value
        },()=>{
            this.props.handleChangeGross(this.state.valueGross)            
        });
    
    }
    handleChangeDisc=(event)=> {
        this.setState({
            valueDisc: event.target.value
        },()=>{
            this.props.handleChangeDisc(this.state.valueDisc)
        });
    }
    handleChangeNetto=(event)=> {
        this.setState({
            valueNetto: event.target.value
        },()=>{
            this.props.handleChangeNetto(this.state.valueNetto)
        });
    }
    handleChangeHja=(event)=> {
        this.setState({
            valueHja: event.target.value
        },()=>{
            this.props.handleChangeHja(this.state.valueHja)
        });
    }
    handleChangeMargin=(event)=> {
        this.setState({
            valueMargin: event.target.value
        },()=>{
            this.props.handleChangeMargin(this.state.valueMargin)
        });
    }


    // //harga master
    // handleChangeGrossMaster=(event)=> {
    //     this.setState({
    //         valueGrossMaster: event.target.value
    //     },()=>{
    //         this.props.handleChangeGrossMaster(this.state.valueGrossMaster)            
    //     });    
    // }
    // handleChangeDiscMaster=(event)=> {
    //     this.setState({
    //         valueDiscMaster: event.target.value
    //     },()=>{
    //         this.props.handleChangeDiscMaster(this.state.valueDiscMaster)
    //     });
    // }
    // handleChangeNettoMaster=(event)=> {
    //     this.setState({
    //         valueNettoMaster: event.target.value
    //     },()=>{
    //         this.props.handleChangeNettoMaster(this.state.valueNettoMaster)
    //     });
    // }
    // handleChangeHjaMaster=(event)=> {
    //     this.setState({
    //         valueHjaMaster: event.target.value
    //     },()=>{
    //         this.props.handleChangeHjaMaster(this.state.valueHjaMaster)
    //     });
    // }
    // handleChangeMarginMaster=(event)=> {
    //     this.setState({
    //         valueMarginMaster: event.target.value
    //     },()=>{
    //         this.props.handleChangeMarginMaster(this.state.valueMarginMaster)
    //     });
    // }

   

    handleChangeQty=(event)=> {
        this.setState({
            valueQty: event.target.value
        },()=>{
            this.props.handleChangeQty(this.state.valueQty)
        });
    }

    handleChangeKelipatan=(event)=> {
        this.setState({
            valueKelipatan: event.target.value
        },()=>{
            this.props.handleChangeKelipatan(this.state.valueKelipatan)
        });
    }

    clearState=()=>{
        this.setState({
            valueGross : '',
            valueDisc : '',
            valueNetto : '',
            valueHja : '',
            valueMargin : '',
            valueQty : '',
            valueKelipatan : ''
        })
    }

    onDismiss=()=>{
        this.clearState();
        this.setState({
            errorVisible : false,
            errorMessage : ''

        })
    }


    validateAddData=()=>
    {
        var supId =   this.state.valueSupId;
        var supName =    this.state.valueSupName;
        var prodId =   this.state.valueProdId;
        var prodName =     this.state.valueProdName;

        var gross =   this.state.valueGross;
        var disc =    this.state.valueDisc;
        var netto =   this.state.valueNetto;
        var hja =     this.state.valueHja;
        var margin =  this.state.valueMargin;

        // var grossMaster =  this.state.valueGrossMaster;
        // var discMaster =   this.state.valueDiscMaster;
        // var nettoMaster =  this.state.valueNettoMaster;
        // var hjaMaster =  this.state.valueHjaMaster;
        // var marginMaster =  this.state.valueMarginMaster;
        
        var qty =   this.state.valueQty;
        var kelipatan =  this.state.valueKelipatan;

        gross = parseInt(gross);
        disc = parseFloat(disc);
        netto= parseInt(netto);
        hja = parseInt(hja);
        margin = parseFloat(margin);

        // grossMaster = parseInt(grossMaster);
        // discMaster = parseFloat(discMaster);
        // nettoMaster= parseInt(nettoMaster);
        // hjaMaster = parseInt(hjaMaster);
        // marginMaster = parseFloat(marginMaster);
        // isNaN(grossMaster) || isNaN(nettoMaster) || isNaN(hjaMaster) || isNaN(discMaster) || isNaN(marginMaster)

        // isNull(supId) || isNull(supName) || isNull(prodId) || isNull(prodName)||
        qty = parseInt(qty);
        kelipatan= parseInt(kelipatan);

        if(isNaN(gross) || isNaN(netto) || isNaN(hja) || isNaN(disc) || isNaN(margin) || isNaN(qty) || isNaN(kelipatan)
            || isNull(prodId)|| isNull(prodName)|| isNull(gross) || isNull(netto) || isNull(hja) || isNull(disc) || isNull(margin) || isNull(qty) || isNull(kelipatan)
        )
        {
            this.setState({
                errorVisible : true,
                errorMessage : 'please fill the data with the correct value and cannot be empty'
            });
            return false;
        }              
        return true; 
    }

    AddNewHarga=()=>
    {
        const isValid = this.validateAddData()

        if(isValid)
        {
            this.props.AddNewHarga();
            this.clearState();
        }
    }


    render(){
        // console.log('detail harga : lokal gros :' + this.state.lokalGross)
        return(
            //<Col sm={2} style={{display : 'flex', border : "solid", borderWidth : 1, marginBottom : 10, background : 'red'}}>              
            <div style={{paddingLeft : 7}}>

            <FormGroup row style ={{marginTop : 10, paddingLeft : 9}} >
                <Label sm={2}>Supplier</Label>
                <Col sm={10} style={{display : 'flex'}}>
                    <Input  disabled ={true} style={{width : '100px'}}  placeholder ={this.props.supId}
                        type="text" value={this.state.valueSupId} 
                        onChange={this.handleChangeSupId}
                    ></Input>
                    <Input disabled ={true}  style={{width : '80%'}}  placeholder ={this.props.supName}
                            type="text" value={this.state.valueSupName} 
                            onChange={this.handleChangeSupName}
                    ></Input>
                    
                </Col>
            </FormGroup >
            <FormGroup row style={{paddingLeft : 9}}>
                <Label sm={2}>Product</Label>
                <Col sm={10} style={{display : 'flex'}}>
                    <Input  style={{width : '100px'}}  placeholder ={'Prod. Id'}
                        type="text" value={this.state.valueProdId} 
                        onChange={this.handleChangeProdId}
                    ></Input>
                    <Input style={{width : '80%'}}  placeholder ={'Prod. Name'}
                        type="text" value={this.state.valueProdName} 
                        onChange={this.handleChangeProdName}
                    ></Input>
                    
                </Col>
            </FormGroup>
                <div style={{display : 'flex', alignContent : "center"}}>
                
                <Form style={{ background : "#B0C4CD", border : 'solid', borderWidth : 1}}>
                
                    <Label  sm={100} style={{fontWeight: "bold", paddingLeft : 10}} >HARGA LOKAL</Label>
                    <FormGroup  row style ={{paddingLeft : 10, paddingTop : 10, marginBottom : 0}}>                                   
                        <Label sm={3}  >Gross</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}} disabled={this.state.edit}  placeholder ={this.props.lokalGross}
                                type="text" value={this.state.valueGross}
                                onChange={this.handleChangeGross}
                            ></Input>                                        
                        </Col>
                    </FormGroup>

                    <FormGroup row style ={{paddingLeft : 10, marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3}  >Discount</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}} disabled={this.state.edit} placeholder ={this.props.lokalDisc}
                                type="text" value={this.state.valueDisc} 
                                onChange={this.handleChangeDisc}
                            ></Input>                                        
                        </Col>
                    </FormGroup>

                    <FormGroup row style ={{paddingLeft : 10, marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3} style={{width : '170px'}}>Netto</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}}  disabled={this.state.edit} placeholder ={this.props.lokalNetto}
                                type="text" value={this.state.valueNetto} 
                                onChange={this.handleChangeNetto}
                            ></Input>                                        
                        </Col>
                    </FormGroup>
                    <FormGroup row style ={{paddingLeft : 10, marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3} >HJA</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}}  disabled={this.state.edit} placeholder ={this.props.lokalHja}
                                type="text" value={this.state.valueHja} 
                                onChange={this.handleChangeHja}
                            ></Input>                                        
                        </Col>
                    </FormGroup>
                    <FormGroup row style ={{paddingLeft : 10, marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3} >Margin</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}} disabled={this.state.edit} placeholder ={this.props.lokalMargin}
                                type="text" value={this.state.valueMargin} 
                                onChange={this.handleChangeMargin}
                            ></Input>                                        
                        </Col>
                    </FormGroup>
                </Form>             
                    
                    
                    
                {/* <Form style={{ paddingLeft : 10, borderTop:"solid", borderBottom : "solid", borderWidth  : 1, background : "#DEEDF3"}}>
                    <Label sm={100} style={{fontWeight: "bold",paddingLeft : 10}}>HARGA MASTER</Label>
                    <FormGroup row style ={{ paddingTop : 10, marginBottom : 0}}>                                   
                        <Label sm={3}  >Gross</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}}  disabled={this.state.edit} placeholder ={this.props.masterGross}
                                type="text" value={this.state.valueGrossMaster} 
                                onChange={this.handleChangeGrossMaster}
                            ></Input>                                        
                        </Col>
                    </FormGroup>

                    <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3}  >Discount</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}}  disabled={this.state.edit} placeholder ={this.props.masterDisc}
                                type="text" value={this.state.valueDiscMaster} 
                                onChange={this.handleChangeDiscMaster}
                            ></Input>                                        
                        </Col>
                    </FormGroup>

                    <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3} style={{width : '170px'}}>Netto</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}}  disabled ={this.state.edit} placeholder ={this.props.masterNetto}
                                type="text" value={this.state.valueNettoMaster} 
                                onChange={this.handleChangeNettoMaster}
                            ></Input>                                        
                        </Col>
                    </FormGroup>
                    <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3} >HJA</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}} disabled ={this.state.edit} placeholder ={this.props.masterHja}
                                type="text" value={this.state.valueHjaMaster} 
                                onChange={this.handleChangeHjaMaster}
                            ></Input>                                        
                        </Col>
                    </FormGroup>
                    <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3} >Margin</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}}  disabled ={this.state.edit}placeholder ={this.props.masterMargin}
                                type="text" value={this.state.valueMarginMaster} 
                                onChange={this.handleChangeMarginMaster}
                            ></Input>                                        
                        </Col>
                    </FormGroup>
                </Form> */}

                {/* <Label sm={100} style={{fontWeight: "bold", color : "white"}}></Label> */}
                <Form style={{ border :'solid', paddingBottom : 20, paddingLeft : 10, paddingTop :50, background : "#B0C4CD", borderWidth : 1, paddingRight : 40}}>
                        <FormGroup row style={{marginBottom : 0}}>                                   
                            <Label sm={5}  >Buy pack</Label> 
                            <Col sm={1} >                                        
                                <Input style={{width : '170px'}}  disabled={true} placeholder ={this.props.buypack}
                                ></Input>                                        
                            </Col>
                        </FormGroup>

                        <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                            <Label sm={5}  >Sell Pack</Label> 
                            <Col sm={1} style={{display : 'flex'}} > 
                                <Input style={{width : '60px'}} disabled={true}placeholder ={this.props.pro_Sellunit}></Input>                                       
                                <Input style={{ marginLeft : 3,  width : '106px'}} disabled={true}placeholder ={this.props.sellPack}></Input>                                        
                            </Col>
                        </FormGroup>

                        <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                            <Label sm={5} style={{width : '170px'}}>Status Moving</Label> 
                            <Col sm={1} >                                        
                                <Input style={{width : '170px'}} disabled={true} placeholder ={this.props.moving_Status}></Input>                                        
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                            <Label sm={5} >Procon</Label> 
                            <Col sm={1} >                                        
                                <Input style={{width : '170px'}} disabled={true} placeholder ={this.props.pro_Ctrlcode}></Input>                                        
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                            <Label sm={5} >Biaya</Label> 
                            <Col sm={1} >                                        
                                <Input style={{width : '170px'}} disabled={true}  placeholder ={0}></Input>                                        
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                            <Label sm={5} >Qty PO Min</Label> 
                            <Col sm={1} >                                        
                                <Input style={{width : '170px'}}  disabled={this.state.edit} placeholder ={this.props.qty}
                                type="text" value={this.state.valueQty}
                                onChange={this.handleChangeQty}
                                ></Input>                                        
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                    
                            <Label sm={5} >Kelipatan</Label> 
                            <Col sm={1} >                                        
                                <Input style={{width : '170px'}} disabled={this.state.edit} placeholder ={this.props.kelipatan}
                                    type="text" value={this.state.valueKelipatan}
                                    onChange={this.handleChangeKelipatan}
                                ></Input>                                        
                            </Col>
                        </FormGroup>
                </Form> 
                                
                </div>

                <Alert color="danger" isOpen={this.state.errorVisible} toggle={()=>this.onDismiss()}>
                    {this.state.errorMessage}
                </Alert> 

                <Button size = 'sm'color = 'success' style ={{marginTop : 5, background: "#349F9B", border: "#349F9B", borderRadius:"8px"}} onClick={()=> this.AddNewHarga()}>Insert</Button>
                {/* {
                    this.state.edit == false && 
                    <Button size = 'sm'color = 'success' style ={{marginTop : 5}}onClick={()=>{this.clearState();this.props.update()}}>Save</Button>
                } */}
            </div>

            //</Col>
        )
    }
}

export default DetailHargaAdd;