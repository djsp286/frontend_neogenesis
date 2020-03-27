import React from 'react';
import {
    Form, FormGroup, Card, CardHeader, Input, Button,
    Label, CardBody, CardFooter,
} from 'reactstrap';
import { 
    MdSearch, MdAdd, MdSatellite, MdCancel, MdSave, MdEdit,
} from 'react-icons/md';
import 'react-tabs/style/react-tabs.css';
 import MasterProdukSupplierAktifAdd from './MasterProdukSupplierAktifAdd';

class MasterProdukSupplierAktif extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            displayCardHeader: "none",
            displayAdd: "inline",
            displayEdit: "none",
        };
    }

    showMainSupplierAktif = () => {
        // this.setState({
        //     displayCardHeader: "inline",
        //     displayAdd: "none",
        //     displayEdit: "none",
        // })

        this.props.func();
        // this.props.activeProcode();
    }

    showAddSupplierAktif = () => {
        this.setState({
            displayCardHeader: "none",
            displayAdd: "inline",
            displayEdit: "none",
        })
    }
    
    render() {

        const {
          
        } = this.state;

        return(
            <div>

                {/* <div
                style={{
                    display: this.state.displayCardHeader,
                }}>
                    <Card className="mb-3">
                        <CardHeader className="d-flex justify-content-between text-nowrap">
                            
                            <select
                            className = "custom-select"
                            >
                                <option value="" selected disabled>Kota Gudang</option>
                                <option value="1">Jakarta Pusat</option>
                                <option value="2">Jakarta Utara</option>
                                <option value="3">Jakarta Selatan</option>
                                <option value="4">Jakarta Timur</option>
                                <option value="5">Jakarta Barat</option>
                            </select>

                            <Button
                            color={"primary"}
                            style={{
                                marginLeft: "5px",
                                marginRight: "5px",
                                float: "right",
                            }}
                            onClick={() => this.showAddSupplierAktif()}
                            >
                                <MdEdit
                                style={{
                                    marginRight: "5px"
                                }}
                                />Edit
                            </Button>

                            <Button
                            color={"primary"}
                            style={{
                                marginLeft: "5px",
                                marginRight: "5px",
                                float: "right",
                            }}
                            onClick={() => this.showAddSupplierAktif()}
                            >
                                <MdAdd
                                style={{
                                    marginRight: "5px"
                                }}
                                />Tambah
                            </Button>
                        </CardHeader>
                    </Card>
            
                </div> */}

                <div
                style={{
                    display: this.state.displayAdd
                }}
                >
                    <MasterProdukSupplierAktifAdd
                    func1 = { () => this.showMainSupplierAktif() } 
                    activeProcode = { this.props.activeProcode }
                    />
                </div>
            </div>
        )
    }
}

export default MasterProdukSupplierAktif;