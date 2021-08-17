==============
Web Fix Filter
==============

.. image:: https://img.shields.io/static/v1.svg?label=license&message=LGPL%20v3&color=blue
   :target: https://www.gnu.org/licenses/lgpl-3.0
   :alt: License: LGPL v3

.. image:: https://img.shields.io/static/v1.svg?label=maturity&message=Stable&color=green
   :target: https://aselcis.com
   :alt: Maturity: Beta

.. image:: https://img.shields.io/static/v1.svg?label=Odoo&message=Commit&color=violet
   :target: https://github.com/odoo/odoo/commit/7308274ac82c02b4d384380e6b4aeefd960d6838
   :alt: Odoo: Commit
---------------------


In windows chrome 89 (at least at version 89.0.4389.114 (29 march 2021))
clicking on a select option doesn't trigger jQuery events if they are
delegated.

For example this happen when selecting a field for custom group or
custom filter in the search view and when selecting a field the dropdown
closes.

This happens because:

- chrome now sends MouseEvent.button[#1] with value -1 instead of
  previousvalue of 0.

- jquery in odoo 12 and under is version 1.11.1 and only executes the
  delegated event if the button value is 0

Reproduction case of the issue [^2]: clicking to choose an option only
logs "non-delegated click".

So for version 11.0 and 12.0 only, this commit is cherry-picking
jquery's commit that is fixing the issue:

jquery/jquery@c82a668

[#1]: https://developer.mozilla.org/docs/Web/API/MouseEvent/button

[^2]: http://jsfiddle.net/cox4gzae

opw-2497859
opw-2499415
opw-2499305
opw-2466991
opw-2506676

backport of #69274

closes #69304

Signed-off-by: Nicolas Lempereur (nle) <nle@odoo.com>
 11.0 (icodeminsk/odoo#2, iSquareInformatics/ISQ_11#1) staging.11.0 tmp.11.0

Credits
=======

Contributors
------------

* David Juaneda <david.juaneda@aselcis.com>

Maintainer
----------

.. image:: https://aselcis.com/git-logo.png
   :alt: Aselcis Consulting S.L
   :target: https://aselcis.com

This module is maintained by Aselcis Consulting S.L.

To contribute to this module, please visit https://aselcis.com/#contactus