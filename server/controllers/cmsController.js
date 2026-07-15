class CmsController {
  constructor(cmsService) {
    this.cmsService = cmsService;
  }

  // --- PUBLIC ---
  getPublicData = async (req, res, next) => {
    try {
      const data = await this.cmsService.getPublicData();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  // --- ADMIN PANEL ---
  getAdminAllData = async (req, res, next) => {
    try {
      const data = await this.cmsService.getAdminAllData();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  // --- HERO ---
  updateHero = async (req, res, next) => {
    try {
      const { title, subtitle, bgImage } = req.body;
      const adminId = req.user.id;
      const result = await this.cmsService.updateHero(title, subtitle, bgImage, adminId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // --- KOMODITAS ---
  createKomoditas = async (req, res, next) => {
    try {
      const result = await this.cmsService.createKomoditas(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateKomoditas = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.cmsService.updateKomoditas(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteKomoditas = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.cmsService.deleteKomoditas(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // --- MARKETPLACE ---
  createMarketplace = async (req, res, next) => {
    try {
      const result = await this.cmsService.createMarketplace(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateMarketplace = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.cmsService.updateMarketplace(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteMarketplace = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.cmsService.deleteMarketplace(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // --- ABOUT ---
  updateAbout = async (req, res, next) => {
    try {
      const { cerita } = req.body;
      const adminId = req.user.id;
      const result = await this.cmsService.updateAbout(cerita, adminId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // --- KONTAK ---
  createKontak = async (req, res, next) => {
    try {
      const result = await this.cmsService.createKontak(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateKontak = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.cmsService.updateKontak(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteKontak = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.cmsService.deleteKontak(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default CmsController;
