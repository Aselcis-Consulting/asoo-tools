# -*- coding: utf-8 -*-
# Part of Aselcis Consulting SL. See LICENSE file for full copyright and licensing details.
import werkzeug
import uuid
from datetime import datetime, timedelta

from odoo import tools, exceptions, fields, SUPERUSER_ID, api, _
from odoo.addons.web.controllers.main import set_cookie_and_redirect, login_and_redirect
from odoo.exceptions import AccessDenied
from odoo.http import request, route, Controller
from odoo import registry as registry_get


class Authenticator(Controller):

    @route("/_auth/info", type="json", auth="none")
    def info(self, db, admin_passwd):
        if tools.config['admin_passwd'] != admin_passwd:
            raise AccessDenied()

        registry = registry_get(db)
        with registry.cursor() as cr:
            env = api.Environment(cr, SUPERUSER_ID, {})
            users = env['res.users'].sudo().search_read([('share', '=', False)], ['id', 'login', 'name'])
        return users

    @route("/_auth/token", type="json", auth="none")
    def token(self, db, admin_passwd, login):
        if tools.config['admin_passwd'] != admin_passwd:
            raise AccessDenied()

        registry = registry_get(db)
        with registry.cursor() as cr:
            env = api.Environment(cr, SUPERUSER_ID, {})
            token = str(uuid.uuid4())
            user = env['res.users'].sudo().search([('login', '=', login)])
            user.write({
                'authenticator_token': token,
                'authenticator_expire_in': datetime.now() + timedelta(seconds=30)
            })
        return token

    @route("/_auth/access", type="http", auth="none")
    def access(self, **kw):
        token = kw.get('token')
        db = kw.get('db')
        registry = registry_get(db)
        with registry.cursor() as cr:
            env = api.Environment(cr, SUPERUSER_ID, {})

            # Get user
            user = env['res.users'].sudo().search([('authenticator_token', '=', token)])
            if not user:
                raise AccessDenied()

            # Check if expire
            if fields.Datetime.from_string(user.authenticator_expire_in) < datetime.now():
                raise AccessDenied()

            # Authentication
            redirect = login_and_redirect(db, user.login, user.authenticator_token)

            # Reset token
            user.write({'authenticator_token': False, 'authenticator_expire_in': False})
            cr.commit()
            return redirect
        return set_cookie_and_redirect('/web')
