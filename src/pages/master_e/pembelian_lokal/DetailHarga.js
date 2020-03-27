import React from 'react'
import { Alert,  Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Form, FormGroup, Label, Input} from 'reactstrap';
import { MdTransferWithinAStation } from 'react-icons/md';


class DetailHarga extends React.Component{

    constructor(props) {
        super(props);       
        this.state = {
            // lokalGross : props.lokalGross,
            // lokalDiscount : props.lokalDiscount,
            // lokalNetto : props.lokalNetto,
            // lokalHja : props.lo
            edit : props.edit,
            dataLokal : props.dataLokal,
            valueGross : '',
            valueDisc : '',
            valueNetto : '',
            valueHja : '',
            valueMargin : '',
            valueQty : '',
            valueKelipatan : '',
            modalSaveDetailHarga : false    ,
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
        if(this.props.valueGross != prevProps.valueGross){
            this.setState({
                valueGross: this.props.valueGross
            });
        }       
    }

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

    setDetailHarga=()=>{
        var gross = this.state.valueGross =='' ? this.props.lokalGross :  this.state.valueGross;
        var disc = this.state.valueDisc =='' ?   this.props.lokalDisc :   this.state.valueDisc;
        var netto = this.state.valueNetto =='' ?  this.props.lokalNetto :  this.state.valueNetto;
        var hja = this.state.valueHja =='' ?   this.props.lokalHja : this.state.valueHja;
        var margin = this.state.valueMargin =='' ? this.props.lokalMargin : this.state.valueMargin;

        var qty = this.state.valueQty =='' ? this.props.qty : this.state.valueQty;
        var kelipatan = this.state.valueKelipatan =='' ? this.props.kelipatan : this.state.valueKelipatan;

        this.setState({
            valueGross : gross,
            valueDisc : disc,
            valueNetto : netto,
            valueHja : hja,
            valueMargin : margin,
            valueQty : qty,
            valueKelipatan : kelipatan
        },() => this.toggleSaveDetailHarga())

    }

    toggleSaveDetailHarga=()=>
    {
        this.setState(prevState => ({
            modalSaveDetailHarga: !prevState.modalSaveDetailHarga
        }));
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

    //validasi inputan save 
    validateUpdateData=()=>
    {
        var gross =  this.state.valueGross =='' ?  this.props.lokalGross :  this.state.valueGross;
        var disc =   this.state.valueDisc =='' ? this.props.lokalDisc :  this.state.valueDisc;
        var netto =  this.state.valueNetto =='' ?  this.props.lokalNetto : this.state.valueNetto;
        var hja = this.state.valueHja =='' ?  this.props.lokalHja :  this.state.valueHja;
        var margin = this.state.valueMargin =='' ? this.props.lokalMargin : this.state.valueMargin;
        
        var qty =  this.state.valueQty =='' ? this.props.qty: this.state.valueQty;
        var kelipatan = this.state.valueKelipatan =='' ? this.props.kelipatan : this.state.valueKelipatan;

        gross = parseInt(gross);
        disc = parseFloat(disc);
        netto= parseInt(netto);
        hja = parseInt(hja);
        margin = parseFloat(margin);

        qty = parseInt(qty);
        kelipatan= parseInt(kelipatan);

        if(isNaN(gross) || isNaN(netto) || isNaN(hja) || isNaN(disc) || isNaN(margin) || isNaN(qty) || isNaN(kelipatan) )
        {
            this.setState({
                errorVisible : true,
                errorMessage : 'please fill the data with the correct value'
            });
            return false;
        }              
        return true; 
    }

    save=()=>
    {   
        const isValid = this.validateUpdateData()

        if(isValid)
        {
            this.props.update()
            this.clearState()
        }

    }


    render(){
        // console.log('detail harga : lokal gros :' + this.state.lokalGross)
        return(
            //<Col sm={2} style={{display : 'flex', border : "solid", borderWidth : 1, marginBottom : 10, background : 'red'}}>              
            <div>
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
                    
                    
                    
                <Form style={{ paddingLeft : 10, borderTop:"solid", borderBottom : "solid", borderWidth  : 1, background : "#DEEDF3"}}>
                    <Label sm={100} style={{fontWeight: "bold",paddingLeft : 10}}>HARGA MASTER</Label>
                    <FormGroup row style ={{ paddingTop : 10, marginBottom : 0}}>                                   
                        <Label sm={3}  >Gross</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}}  disabled={true} placeholder ={this.props.masterGross}></Input>                                        
                        </Col>
                    </FormGroup>

                    <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3}  >Discount</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}}  disabled={true} placeholder ={this.props.masterDisc}></Input>                                        
                        </Col>
                    </FormGroup>

                    <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3} style={{width : '170px'}}>Netto</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}}  disabled ={true} placeholder ={this.props.masterNetto}></Input>                                        
                        </Col>
                    </FormGroup>
                    <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3} >HJA</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}} disabled ={true} placeholder ={this.props.masterHja}></Input>                                        
                        </Col>
                    </FormGroup>
                    <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                   
                        <Label sm={3} >Margin</Label> 
                        <Col sm={1} >                                        
                            <Input style={{width : '170px'}}  disabled ={true}placeholder ={this.props.masterMargin}></Input>                                        
                        </Col>
                    </FormGroup>
                </Form>

                {/* <Label sm={100} style={{fontWeight: "bold", color : "white"}}></Label> */}
                <Form style={{ border :'solid', paddingLeft : 10, paddingTop :50, background : "#B0C4CD", borderWidth : 1, paddingRight : 40}}>
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
                {
                    this.state.edit == false && 
                    <Button size = 'sm'color = 'success' style = {{background: "#349F9B", border: "#349F9B", borderRadius:"8px" , marginTop : 5}} onClick={()=>{this.setDetailHarga()}}>Save</Button>

                }

                {/* modal save detail harga */}
                <Modal size = 'lg' isOpen={this.state.modalSaveDetailHarga} toggle={()=> this.toggleSaveDetailHarga()} className={this.props.className}>
                    <ModalHeader toggle={()=> this.toggleSaveDetailHarga()}>Save Confirmation</ModalHeader>
                    <ModalBody style ={{paddingLeft : 25}}>
                    <p>Apakah anda yakin untuk menyimpan data berikut ini?
                    </p>
                    <div style={{display : 'flex', alignContent : "center"}}>

                        <Form style={{ background : "#B0C4CD", border : 'solid', borderWidth : 1}}>
                        
                            <Label  sm={100} style={{fontWeight: "bold", paddingLeft : 10}} >HARGA LOKAL</Label>
                            <FormGroup  row style ={{paddingLeft : 10, paddingTop : 10, marginBottom : 0}}>                                   
                                <Label sm={3}  >Gross</Label> 
                                <Col sm={1} >                                        
                                    <Input style={{width : '170px'}} disabled={true}  placeholder ={this.state.valueGross}
                                    ></Input>                                        
                                </Col>
                            </FormGroup>

                            <FormGroup row style ={{paddingLeft : 10, marginBottom : 0, marginTop : 0}}>                                   
                                <Label sm={3}  >Discount</Label> 
                                <Col sm={1} >                                        
                                    <Input style={{width : '170px'}} disabled={true} placeholder ={this.state.valueDisc}
                                    ></Input>                                        
                                </Col>
                            </FormGroup>

                            <FormGroup row style ={{paddingLeft : 10, marginBottom : 0, marginTop : 0}}>                                   
                                <Label sm={3} style={{width : '170px'}}>Netto</Label> 
                                <Col sm={1} >                                        
                                    <Input style={{width : '170px'}}  disabled={true} placeholder ={this.state.valueNetto}
                                        
                                    ></Input>                                        
                                </Col>
                            </FormGroup>
                            <FormGroup row style ={{paddingLeft : 10, marginBottom : 0, marginTop : 0}}>                                   
                                <Label sm={3} >HJA</Label> 
                                <Col sm={1} >                                        
                                    <Input style={{width : '170px'}}  disabled={true} placeholder ={this.state.valueHja}
                                        
                                    ></Input>                                        
                                </Col>
                            </FormGroup>
                            <FormGroup row style ={{paddingLeft : 10, marginBottom : 0, marginTop : 0}}>                                   
                                <Label sm={3} >Margin</Label> 
                                <Col sm={1} >                                        
                                    <Input style={{width : '170px'}} disabled={true} placeholder ={this.state.valueMargin}
                                        
                                    ></Input>                                        
                                </Col>
                            </FormGroup>
                        </Form>            

                        {/* <Label sm={100} style={{fontWeight: "bold", color : "white"}}></Label> */}
                        <Form style={{ border :'solid', paddingBottom : 10, paddingLeft : 10, paddingTop :50, background : "#B0C4CD", borderWidth : 1, paddingRight : 40}}>
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
                                        <Input style={{ marginLeft : 3,  width : '106px'}} disabled={true}placeholder ={this.state.sellPack}></Input>                                        
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
                                        <Input style={{width : '170px'}}  disabled={true} placeholder ={this.state.valueQty}
                                        
                                        ></Input>                                        
                                    </Col>
                                </FormGroup>
                                <FormGroup row style={{marginBottom : 0, marginTop : 0}}>                                    
                                    <Label sm={5} >Kelipatan</Label> 
                                    <Col sm={1} >                                        
                                        <Input style={{width : '170px'}} disabled={true} placeholder ={this.state.valueKelipatan}
                                            
                                        ></Input>                                        
                                    </Col>
                                </FormGroup>
                        </Form> 
                        
                        </div>
                    </ModalBody>
                    <ModalFooter style={{marginTop : 5}}>
                        {/* <Button color="primary" onClick={()=> {this.props.update();this.clearState(); this.toggleSaveDetailHarga()}}>Simpan</Button>{' '} */}
                        <Button color="primary" style = {{background: "#349F9B", border: "#349F9B", borderRadius: "8px" }} onClick={()=> {this.save() ; this.toggleSaveDetailHarga()}}>Simpan</Button>{' '}
                        <Button color="secondary" style = {{background: "#F8A151", border: "#F8A151", borderRadius: "8px" }} onClick={()=>this.toggleSaveDetailHarga()}>Batalkan</Button>
                    </ModalFooter>
                </Modal>

                <Alert color="danger" isOpen={this.state.errorVisible} toggle={()=>this.onDismiss()}>
                    {this.state.errorMessage}
                </Alert> 

                

            </div>      

            //</Col>
        )
    }
}

export default DetailHarga;