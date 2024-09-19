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
        return jsonify({'success':False, 
                        'msg': 'Todos los campos son obligatorios'})
    user_exist = User.query.filter_by(email=email).first()

    if user_exist:
        return jsonify({'success':False,
                        'msg':'Este usuario ya está registrado'}),400
    
    new_user= User(email=email, password=password, is_active=True)

    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=new_user.id)
    return jsonify({'success':True,
                    'msg': 'Ha sido registrado correctamente',
                    'token': access_token,'user':new_user.serialize()}), 200
   
@api.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email')
        password = request.json.get('password')

        if not email or not password:
            return jsonify({'success': False, 'msg': 'Por favor, proporciona correo y contraseña.'}), 400

        user = User.query.filter_by(email=email).first()

        if not user or user.password != password:
            return jsonify({'success': False, 'msg': 'Usuario o contraseña incorrectos.'}), 401

        access_token = create_access_token(identity=user.id)
        return jsonify({
            'success': True,
            'msg': 'Inicio de sesión exitoso.',
            'token': access_token,
            'user': user.serialize()
        }), 200

    except Exception as e:
        print(f"Error en login: {str(e)}")  
        return jsonify({'success': False, 'msg': 'Ocurrió un error interno, por favor intenta de nuevo.'}), 500


@api.route('/private', methods=['GET'])
@jwt_required()
def page_private():
    user_id= get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        return jsonify({'success': True, 'msg': 'Has logrado entrar a una página privada'}), 200
    return jsonify({'success': False, 'msg': 'No estás logeado'}), 400

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