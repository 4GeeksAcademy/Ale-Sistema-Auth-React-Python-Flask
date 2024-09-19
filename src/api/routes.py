"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import get_jwt_identity, create_access_token, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/signup', methods=['POST'])
def signup_user():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email or not password:
        return jsonify({'success':False, 'msg': 'Todos los campos son necesarios'})
    user_exist = User.query.filter_by(email=email).first()
    if user_exist:
        return jsonify({'success':False,'msg':'el email ya está registrado'}),400
    
    new_user= User(email=email, password=password, is_active=True)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=new_user.id)
    return jsonify({'success':True,'msg': f'Ha sido registrado correctamente','token': access_token,'user':new_user.serialize()}), 200
   
@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    user = User.query.filter_by(email=email, password=password).first()

    if user:
        if password:
            access_token = create_access_token(identity=user.id)
            return jsonify({'success':True,'msg': f'Se ha iniciado sesión correctamente','token': access_token,'user':user.serialize()}), 200
        return jsonify({'success': False, 'msg': 'La combinacion usuario/contraseña no es valida'}), 400
    return jsonify({'success': False, 'msg': 'El correo electronico no tiene una cuenta asociada'}), 404

@api.route('/private', methods=['GET'])
@jwt_required()
def page_private():
    user_id= get_jwt_identity
    user = User.query.get(user_id)
    if user:
        return jsonify({'success': True, 'msg': 'Has logrado entrar a una página privada'})
    return jsonify({'success': False, 'msg': 'No estás logeado'})

@api.route('/token', methods=['GET'])
@jwt_required()
def token():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if user:
        return jsonify({
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active
        }), 200
    else:
        return jsonify({"msg": "Usuario no encontrado"}), 404

if __name__ == '__main__':
    api.run(host='0.0.0.0', port=3245, debug=True)