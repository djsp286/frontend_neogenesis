import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, ButtonGroup, InputGroup,
    InputGroupAddon, Form, FormGroup
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdSearch, MdAutorenew, MdEdit, MdDelete } from 'react-icons/md';


export default class TambahTema extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:false
        };
    }


    updateInputValue(evt, field) {
        let currentDepart = this.state.currentDepart;
        currentDepart[field] = evt.target.value;
        this.setState({ currentDepart });

    }
    //modal Tambah dalam tambah
    state = {
        modal_tambah: false,
        modal_backdrop_tambah: false,
        modal_nested_parent_tambah: false,
        modal_nested_tambah: false,
        backdrop: true,
    };


    toggle = modalType => (event) => {

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`]

        }, () => {
            if (this.state.modal_nested_parent === true) {
                document.getElementById("unit").focus();
            }
        });

    };


    canBeSubmitted() {
        // const { currentDepart } = this.state;
        // return currentDepart.dept_name.length > 0 && currentDepart.dept_name.trim() !== "" && currentDepart.dept_name.trim().length <= 50;
        return true;
    }
    render() {
        const externalCloseBtn = (
            <button
                className="close"
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '20px',
                    fontSize: '3rem',
                }}
                onClick={this.props.onClose}>
                &times;
            </button>
        );

        const { loading } = this.state;
        const isEnabled = this.canBeSubmitted();
        return (
            <React.Fragment>
                <Form>
                    <FormGroup>
                        <Label >Nama Tema</Label>
                        <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Nama Template" />
                    </FormGroup>
                    <FormGroup>
                        <Label>Outlet</Label>
                        <Input type="select" autoComplete="off" name="select" value={this.state.value} onChange={evt => this.updateInputValue(evt, "dept_lokasi")}>
                            <option value="" name="outlet" id="outlet" selected disabled hidden>Pilih Outlet</option>
                            <option>Century TA</option>
                            <option>Century CP</option>
                            <option>Century CL</option>
                            <option>Century Senayan City</option>
                            <option>Century Grand Indonesia</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Template</Label>
                        <Input type="select" autoComplete="off" name="select" value={this.state.value} onChange={evt => this.updateInputValue(evt, "dept_lokasi")}>
                            <option value="" name="outlet" id="outlet" selected disabled hidden>Pilih Template</option>
                            <option>Template 1</option>
                            <option>Template 2</option>
                            <option>Template 3</option>
                            <option>Template 4</option>
                            <option>Template 5</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Button size="sm" onClick={this.toggle('nested_parent_tambah')} >Tambah</Button>
                        <Modal
                            style={{ width: '100%', height: '100%' }}
                            onExit={this.handleClose}
                            size="md"
                            isOpen={this.state.modal_nested_parent_tambah}
                            toggle={this.toggle('nested_parent_tambah')}
                            className={this.props.className}
                            external={externalCloseBtn}
                            centered>
                            <ModalHeader toggle={this.toggle('nested_parent_tambah')}>
                                Tambah Deskripsi Tema
            </ModalHeader>
                            <ModalBody>
                                <Form>
                                    <FormGroup>
                                        <Label >Nama Video</Label>
                                        <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Nama Video" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label >URL</Label>
                                        <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Link URL" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label >Procod</Label>
                                        <Input type="number" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Procod" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label >Deskripsi</Label>
                                        <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Deskripsi" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label >URL Gambar</Label>
                                        <Input type="input" autoComplete="off" id="unit" onChange={evt => this.updateInputValue(evt, "dept_name")} name="namaunit" placeholder="Link URL Gambar" />
                                    </FormGroup>
                                </Form>
                                <br></br>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.toggle('nested_parent_tambah')}>
                                    Simpan
                                     </Button>
                                <Modal
                                    style={{ width: '100%', height: '100%' }}
                                    onExit={this.handleClose}
                                    isOpen={this.state.modal_nested_edit}
                                    toggle={this.toggle('nested_tambah')}
                                    centered>
                                    <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                    <ModalBody>
                                        Apakah Anda yakin ingin menyimpan data ini?
                        </ModalBody>
                                    <ModalFooter>
                                        <Button id="btnEdit" color="primary" /*onClick={(e) => this.updateDept('Y', this.state.editDept, this.state.currentDepart, e)}*/ onClick={this.toggle('nested_parent_edit')} disabled={loading}>
                                            {!loading && "Ya"}
                                            {loading && (
                                                <MdAutorenew />
                                            )}
                                            {loading && "Sedang diproses"}
                                        </Button>
                                        {!loading && <Button
                                            color="secondary"
                                            onClick={this.toggle('nested_tambah')}>
                                            Tidak
                        </Button>}
                                    </ModalFooter>
                                </Modal>
                                <Button color="secondary" onClick={this.props.onClose}>
                                    Batal
                </Button>
                            </ModalFooter>
                        </Modal>
                    </FormGroup>
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <CardBody>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Nama Video</th>
                                                <th>URL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>A</td>
                                                <td>A</td>
                                            </tr>
                                            <tr>
                                                {/* <td></td>
                                    <td></td> */}
                                            </tr>
                                            <tr>
                                                {/* <td></td>
                                    <td></td> */}
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col>
                            <Card className="mb-3">
                                <CardBody>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Procod</th>
                                                <th>Deskripsi</th>
                                                <th>URL Gambar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>B</td>
                                                <td>B</td>
                                                <td>B</td>
                                            </tr>
                                            <tr>
                                                {/* <td></td>
                                    <td></td> */}
                                            </tr>
                                            <tr>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* TEST */}

                </Form>
                <br></br>
                <div>
                    <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label>
                    <Button disabled={!isEnabled} color="primary"style={{float:"right", marginLeft:"6px"}} onClick={this.toggle('nested')}>
                        Simpan
                    </Button>
                    <Modal
                        onExit={this.handleClose}
                        isOpen={this.state.modal_nested}
                        toggle={this.toggle('nested')}>
                        <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                        <ModalBody>
                            {/* <strong>Nama Departemen: {this.state.currentDepart && this.state.currentDepart.dept_name}</strong>
                            <br />
                            <strong>Lokasi Departemen: {this.state.currentDepart && this.setLokasi(parseInt(this.state.currentDepart.dept_lokasi, 10))}</strong>
                            <br />
                            <br></br> */}
                            Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                        <ModalFooter>
                            <Button color="primary" /*onClick={this.insertMasterDept(this.state.currentDepart)}*/ onClick={this.props.onClose} disabled={loading}>
                                {!loading && "Ya"}
                                {loading && (
                                    <MdAutorenew />
                                )}
                                {loading && "Sedang diproses"}
                            </Button>{' '}
                            {!loading && <Button
                                color="secondary"
                                onClick={this.toggle('nested')}>
                                Tidak
                            </Button>}
                        </ModalFooter>
                    </Modal>
                    {' '}
                    <Button color="secondary" style={{float:"right"}} onClick={this.props.onClose}>
                        Batal
                    </Button>
                    </div>
            </React.Fragment>


        )
    }


}